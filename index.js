const express = require('express');
const path = require('path');
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("./models/user");
const postModel = require("./models/post");
const upload = require("./configs/multerConfig");
const { registerValidator, checkValidation } = require("./configs/customValidator");
require("dotenv").config();

const app = express();

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views")); // Ensure views directory is correct
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get('/', LogProfileIfCookiePresent, (req, res) => {
    let RedMessage = req.cookies.profile_message || "";
    let GreenMessage = req.cookies.green_message || "";
    res.clearCookie("profile_message");
    res.clearCookie("green_message");

    res.render('index', { RedMessage, GreenMessage });
})

app.get('/register', (req, res) => {
    let message = req.cookies.flash_message || "";
    res.clearCookie("flash_message");
    res.render('register', { message });
})

app.post("/register", registerValidator, checkValidation, async (req, res) => {
    try {
        let { name, username, email, password } = req.body;

        let existingUser = await userModel.findOne({ email });
        let existingUsername = await userModel.findOne({ username });

        if (existingUser) {
            res.cookie("flash_message", "User with this email already exists. Please log in.", { maxAge: 5000 });
            return res.redirect("/login");
        }

        if (existingUsername) {
            res.cookie("flash_message", "Username already taken.", { maxAge: 5000 });
            return res.redirect("/register");
        }

        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);

        let user = await userModel.create({
            name,
            username,
            email,
            password: hashedPassword
        });

        let token = jwt.sign({ email: email, username: user._id }, process.env.VER_KEY);
        res.cookie("token", token);
        res.cookie("green_message", "User Registered Successfully", { maxAge: 5000 });

        res.redirect("/profile");
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong. Please try again.");
    }
});

app.get('/login', (req, res) => {
    let message = req.cookies.flash_message || "";
    res.clearCookie("flash_message");
    res.render('login', { message });
})

app.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;

        let user = await userModel.findOne({ email });

        if (!user) {
            res.cookie("flash_message", "User not found. Please register first.", { maxAge: 5000 });
            return res.redirect("/register");
        }

        let isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.cookie("flash_message", "Invalid credentials. Please try again.", { maxAge: 5000 });
            return res.redirect("/login");
        }

        let token = jwt.sign({ email: email, username: user._id }, process.env.VER_KEY);
        res.cookie("token", token);
        res.cookie("green_message", "User Logged In Succesfully", { maxAge: 5000 });

        res.redirect("/profile");
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong. Please try again.");
    }
});

app.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.redirect("/");
})

app.get('/profile', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate("posts");

    let RedMessage = req.cookies.profile_message || "";
    let GreenMessage = req.cookies.green_message || "";
    res.clearCookie("profile_message");
    res.clearCookie("green_message");

    res.render('profile', { user, RedMessage, GreenMessage });
})

app.get('/feed', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate("posts");
    let posts = await postModel.find().populate("user");

    let RedMessage = req.cookies.profile_message || "";
    let GreenMessage = req.cookies.green_message || "";
    res.clearCookie("profile_message");
    res.clearCookie("green_message");

    res.render('feed', { user, RedMessage, GreenMessage, posts });
})

app.post("/post", upload.single("postPic"), isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    let { content } = req.body;
    let redirectPage = req.query.redirect || "profile";

    if (!req.file) {
        res.cookie("profile_message", "Error Posting", { maxAge: 5000 });
        return res.redirect(`/${redirectPage}`); // Ensure function stops execution
    }

    let post = await postModel.create({
        user: user._id,
        content,
        postPic: {
            data: req.file.buffer,
            contentType: req.file.mimetype,
        }
    })

    user.posts.push(post._id);
    await user.save();

    res.cookie("green_message", "Post Created successfully.", { maxAge: 5000 });
    res.redirect(`/${redirectPage}`);
})

app.post('/like/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.id }).populate("user");
    let user = await userModel.findOne({ email: req.user.email })
    let redirectPage = req.query.redirect || "profile";

    if (post.likes.indexOf(user._id) === -1) {
        post.likes.push(user._id);
    }

    else {
        post.likes.splice(post.likes.indexOf(user._id), 1);
    }

    await post.save();
    res.redirect(`/${redirectPage}?lanim:true`);
})

app.post("/edit", upload.single("postPic"), isLoggedIn, async (req, res) => {
    let redirectPage = req.query.redirect || "profile";

    try {
        const { originalContent, newContent } = req.body;
        let post = await postModel.findOne({ content: originalContent }).populate("user");

        if (!post) {
            res.cookie("profile_message", "Post Not Found", { maxAge: 5000 });
            return res.redirect(`/${redirectPage}`);
        }

        // Build update object dynamically
        let updateFields = { content: newContent };
        if (req.file) {
            updateFields.postPic = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }

        await postModel.findOneAndUpdate(
            { content: originalContent },
            updateFields
        );

        res.cookie("green_message", "Post Edited Successfully", { maxAge: 5000 });
        return res.redirect(`/${redirectPage}?lanim=true`);
    } catch (err) {
        res.cookie("profile_message", "Error Updating Post", { maxAge: 5000 });
        return res.redirect(`/${redirectPage}`);
    }
});


app.post('/delete/:id', isLoggedIn, async (req, res) => {
    let redirectPage = req.query.redirect || "profile";

    try {
        let post = await postModel.findById(req.params.id).populate("user");

        if (!post) {
            res.cookie("profile_message", "Post not found.", { maxAge: 5000 });
            return res.redirect(`/${redirectPage}`);
        }

        if (!post.user || post.user.email !== req.user.email) {
            res.cookie("profile_message", "Unauthorized to delete this post.", { maxAge: 5000 });
            return res.redirect(`/${redirectPage}`);
        }

        // Remove post from user's post array
        await userModel.updateOne(
            { email: req.user.email },
            { $pull: { posts: post._id } }
        );

        // Delete the post
        await postModel.deleteOne({ _id: post._id });

        res.cookie("green_message", "Post deleted successfully.", { maxAge: 5000 });
        return res.redirect(`/${redirectPage}`);

    } catch (error) {
        console.error("Error deleting post:", error);
        res.cookie("profile_message", "An error occurred while deleting the post.", { maxAge: 5000 });
        return res.redirect(`/${redirectPage}`);
    }
});

app.post("/DelAcc", isLoggedIn, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        let userId = user._id;
        let redirectPage = req.query.redirect || "profile";

        await postModel.deleteMany({ user: userId });
        await userModel.findByIdAndDelete(userId);
        res.clearCookie("token");

        res.cookie("green_message", "Account Deleted Succesfully", { maxAge: 5000 });
        return res.redirect(`/${redirectPage}`);

    } catch (error) {
        res.cookie("profile_message", "Error Deleting Account.", { maxAge: 5000 });
        return res.redirect(`/${redirectPage}`);
    }
})

async function isLoggedIn(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/");
    }

    try {
        let data = jwt.verify(token, process.env.VER_KEY);
        req.user = data;
        next();
    } catch (err) {
        console.error("JWT Verification Error:", err);
        res.redirect("/login");
    }
}

function LogProfileIfCookiePresent(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return next();
    }

    try {
        let data = jwt.verify(token, process.env.VER_KEY);
        req.user = data;
        return res.redirect("/profile");
    } catch (err) {
        console.error("JWT Verification Error:", err);
        return next();
    }
}

app.listen(process.env.PORT || 5000, function () {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
    console.log("Press Ctrl + C to stop the server");
});