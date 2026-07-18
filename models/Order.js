import mongoose from "mongoose";
import { nanoid } from "nanoid";

const OrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    image: String,
    price: Number,
    quantity: { type: Number, default: 1 },
    variant: String
  },
  { _id: false }
);

const StatusHistorySchema = new mongoose.Schema(
  {
    status: String,
    note: String,
    at: { type: Date, default: Date.now }
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      default: () => `ZVM-${nanoid(8).toUpperCase()}`
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    guestEmail: String,
    items: [OrderItemSchema],
    shipping: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: String,
      district: String,
      area: String,
      fullAddress: { type: String, required: true }
    },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, default: null },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["bkash", "nagad", "cod"],
      default: "cod"
    },
    paymentTransactionId: { type: String, default: "" },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid"
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending"
    },
    statusHistory: [StatusHistorySchema]
  },
  { timestamps: true }
);

OrderSchema.pre("save", function (next) {
  if (this.isNew) {
    this.statusHistory.push({ status: this.status, note: "Order placed" });
  }
  next();
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
