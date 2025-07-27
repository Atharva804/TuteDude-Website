import bcrypt from "bcryptjs";
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, location } = req.body;

    if (!name || !email || !phone || !password || !location) {
      return res.status(400).json({
        status: 400,
        message:
          "All fields are required: name, email, phone, password, location",
      });
    }

    const existingUser = await db("users").where({ email }).first();
    if (existingUser) {
      return res.status(409).json({
        status: 409,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [newUser] = await db("users")
      .insert({
        name,
        email,
        phone,
        password: hashedPassword,
        location,
      })
      .returning(["id", "name", "email", "phone", "location"]);

    return res.status(201).json({
      status: 201,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong during registration",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        message: "Email and password are required",
      });
    }

    const user = await db("users").where({ email }).first();
    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 401,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY, {
      expiresIn: "5d",
    });

    return res.status(200).json({
      status: 200,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong during login",
      error: error.message,
    });
  }
};
