import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { z } from "zod";
import { db, withDb } from "../config/db.js";
import { signToken } from "../utils/jwt.js";

const signupSchema = z.object({
  name: z.string().trim().min(1, "Enter your full name."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string(),
  role: z.enum(["citizen", "field", "admin"]).default("citizen"),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

function toPublicUser(u) {
  const { passwordHash, ...rest } = u;
  return rest;
}

export async function signup(req, res) {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { name, email, password, role } = parsed.data;

  const existing = db.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) return res.status(409).json({ error: "An account with this email already exists." });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: nanoid(10),
    name,
    email,
    role,
    provider: "password",
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  await withDb((data) => data.users.push(user));

  const token = signToken({ sub: user.id, email: user.email, role: user.role });
  res.status(201).json({ token, user: toPublicUser(user) });
}

export async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { email, password } = parsed.data;

  const user = db.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || !user.passwordHash) {
    return res.status(401).json({ error: "Invalid email or password." });
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid email or password." });

  const token = signToken({ sub: user.id, email: user.email, role: user.role });
  res.json({ token, user: toPublicUser(user) });
}

// Demo OAuth stand-in — mirrors the frontend's previous mock so the flow
// keeps working end-to-end. Swap this for a real Google/LinkedIn OAuth
// code exchange when client IDs are available.
export async function loginWithProvider(req, res) {
  const provider = req.params.provider;
  if (!["google", "linkedin"].includes(provider)) {
    return res.status(400).json({ error: "Unsupported provider." });
  }
  const demoProfile = {
    google: { name: "Priya Sharma", email: "priya.sharma@gmail.com" },
    linkedin: { name: "Arjun Mehta", email: "arjun.mehta@linkedin.com" },
  }[provider];

  let user = db.data.users.find((u) => u.email === demoProfile.email);
  if (!user) {
    user = {
      id: nanoid(10),
      name: demoProfile.name,
      email: demoProfile.email,
      role: "citizen",
      provider,
      passwordHash: null,
      createdAt: new Date().toISOString(),
    };
    await withDb((data) => data.users.push(user));
  }
  const token = signToken({ sub: user.id, email: user.email, role: user.role });
  res.json({ token, user: toPublicUser(user) });
}

export async function me(req, res) {
  const user = db.data.users.find((u) => u.id === req.user.sub);
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ user: toPublicUser(user) });
}
