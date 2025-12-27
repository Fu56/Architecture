import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db";
import { env } from "../config/env";

export const register = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, password, role_name } = req.body; // Expect role_name like 'Student' or 'Faculty'

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Domain validation if needed
    if (
      env.allowedEmailDomain &&
      !email.endsWith(`@${env.allowedEmailDomain}`)
    ) {
      return res
        .status(400)
        .json({
          message: `Please use a @${env.allowedEmailDomain} email address.`,
        });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Resolve Role
    let roleId: number | null = null;
    if (role_name) {
      const role = await prisma.role.findUnique({ where: { name: role_name } });
      if (role) roleId = role.id;
    } else {
      // Default to Student if exists, otherwise null (or handle error)
      const defaultRole = await prisma.role.findUnique({
        where: { name: "Student" },
      });
      if (defaultRole) roleId = defaultRole.id;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        roleId: roleId,
        status: "active",
      },
      include: {
        role: true,
      },
    });

    const token = jwt.sign(
      { id: user.id, role: user.role?.name, email: user.email },
      env.jwtSecret,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role?.name,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role?.name, email: user.email },
      env.jwtSecret,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role?.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
