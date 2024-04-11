import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    required: true,
  },
});

productSchema.method('toClient', function () {
  const product = this.toObject();
  product.id = product._id;
  delete product._id;

  return product;
});

export default model('Product', productSchema);
