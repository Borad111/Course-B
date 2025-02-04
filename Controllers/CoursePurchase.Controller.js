const Strip = require("stripe");
const dotenv = require("dotenv");
dotenv.config();
const Course = require("../Models/CourseModel");
const CoursePurchase = require("../Models/PuchaseCourse");
const Lecture = require("../Models/LectureModel");
const User = require("../Models/UserModel");

const stripe = Strip(process.env.STRIP_SECRET_KEY);

const CreateCheackOutSession = async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found",
      });
    }
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100, // Amount in paise (lowest denomination)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/course-progress/${courseId}`, // once payment successful redirect to course progress page
      cancel_url: `http://localhost:5173/course-detail/${courseId}`,
      metadata: {
        courseId: courseId,
        userId: userId,
      },
      shipping_address_collection: {
        allowed_countries: ["IN"], // Optionally restrict allowed countries
      },
    });

    if (!session.url) {
      return res
        .status(400)
        .json({ success: false, message: "Error while creating session" });
    }

    // Save the purchase record
    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json({
      success: true,
      url: session.url, // Return the Stripe checkout URL
    });
  } catch (error) {
    console.log("Error in creating cheackout session", error);
  }
};

const stripeWebhook = async (req, res) => {
  console.log("Strip Hook Call");
  let event;
  try {
    const payloadString = JSON.stringify(req.body, null, 2);
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });

    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  // Handle the checkout session completed event
  if (event.type === "checkout.session.completed") {
    console.log("check session complete is called");

    try {
      const session = event.data.object;

      const purchase = await CoursePurchase.findOne({
        paymentId: session.id,
      }).populate({ path: "courseId" });

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }
      purchase.Status = "completed";

      // Make all lectures visible by setting `isPreviewFree` to true
      if (purchase.courseId && purchase.courseId.lectures.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      await purchase.save();

      // Update user's enrolledCourses
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrollCourses: purchase.courseId._id } }, // Add course ID to enrolledCourses
        { new: true }
      );

      // Update course to add user ID to enrolledStudents
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudent: purchase.userId } }, // Add user ID to enrolledStudents
        { new: true }
      );
    } catch (error) {
      console.error("Error handling event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  res.status(200).send();
};

const GetCourseDetailsWithParchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found",
      });
    }

    console.log(courseId, userId);
    const purchased = await CoursePurchase.findOne({ userId, courseId });
    console.log("purchased", purchased);

    let status = false;
    if (purchased) {
      status = purchased.Status === "completed" ? true : false;
    }
    return res.status(200).json({
      success: true,
      course,
      status, // Convert purchased to boolean
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in Get Course Details With Parchase Status",
      error: error.message,
    });
  }
};

const GetAllPurchaseCourse = async (_, res) => {
  try {
    const PurchaseCourses = await CoursePurchase.find({
      Status: "completed",
    }).populate("courseId");
    if (!PurchaseCourses) {
      return res.status(404).json({
        success: false,
        message: "No Purchased Course Found",
      });
    }
    return res.status(200).json({
      success: true,
      PurchaseCourses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in Get All Purchased Course",
      error: error.message,
    });
  }
};


module.exports = { CreateCheackOutSession, stripeWebhook,GetCourseDetailsWithParchaseStatus,GetAllPurchaseCourse };
