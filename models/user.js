import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    resetToken: String,
    resetTokenExp: Date,
    cart: {
      items: [
        {
          count: {
            type: Number,
            required: true,
            default: 1,
          },
          productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
          },
        },
      ],
    },
    roles: [
      {
        type: String,
        ref: 'Role',
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.addToCart = function (product) {
  const items = [...this.cart.items];
  const idx = items.findIndex((p) => {
    return p.productId.toString() === product._id.toString();
  });

  if (idx >= 0) {
    items[idx].count += 1;
  } else {
    items.push({
      productId: product._id,
      count: 1,
    });
  }

  this.cart = { items };
  return this.save();
};

userSchema.methods.removeFromCart = function (id) {
  let items = [...this.cart.items];
  const idx = items.findIndex((p) => p.productId.toString() === id.toString());

  if (items[idx].count > 1) {
    items[idx].count--;
  } else {
    items = items.filter((p) => p.productId.toString() !== id.toString());
  }

  this.cart = { items };
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

export default model('User', userSchema);
