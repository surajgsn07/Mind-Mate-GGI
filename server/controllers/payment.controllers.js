// import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// import { RagPicker } from "../models/ragPicker.model.js";
// import { User } from "../models/user.model.js";
// import Payment from "../models/payment.model.js";
import asyncHandler from 'express-async-handler';
import Razorpay from "razorpay";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js"; 

// import { Booking } from "../models/booking.model.js";
const createOrder = asyncHandler(async (req, res) => {
    const { amt } = req.body;
    const key_secret = process.env.RAZORPAY_API_SECRET;
    const key_id = process.env.RAZORPAY_API_KEY;
    const instance = new Razorpay({
        key_id,
        key_secret
    }
    )

    const amount=amt||'9500';
    const options={
        amount:Number.parseInt(amount)*100,
        currency:"INR",
    }

    const paymentInit = await instance.orders.create(options);

    res.status(201).json(new ApiResponse(201, "Order created successfully", paymentInit));
})

const verifyOrder = asyncHandler(async (req, res) => {
    
    // const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    

    // // const ragpicker = await RagPicker.findById(payment.ragpicker_id);
    const secret = process.env.RAZORPAY_API_SECRET;
    const isValid = validatePaymentVerification(
        {
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id
        },
        razorpay_signature,
        secret
    );
    
        
        res.redirect(`${process.env.CLIENT_URL}/payment/?paymentdone=true`);
}   );

export {
    createOrder,
    verifyOrder
};