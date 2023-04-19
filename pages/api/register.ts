import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "../../lib/prismadb";
import bcrypt from "bcrypt";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).end();
  }

  try {
    const { username, email, password } = req.body;
    const existingUser = prismadb.user.findUnique({
      where: {
        email
      }
    });
    if (existingUser) {
      return res.status(422).json({ error: "Email taken" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prismadb.user.create({
      data: {
        username,
        email,
        hashedPassword,
        image: '',
        emailVerified: new Date()
      }
    });

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}