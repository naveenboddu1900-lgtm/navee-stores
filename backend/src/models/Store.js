const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^[a-z0-9-]+$/ },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  plan: { type: String, enum: ['starter', 'growth', 'scale'], default: 'growth' },
  status: { type: String, enum: ['active', 'paused', 'review'], default: 'active', index: true },
  currency: { type: String, default: 'USD', uppercase: true, minlength: 3, maxlength: 3 },
  brandColor: { type: String, default: '#ff3d2e' }
}, { timestamps: true });

storeSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Store', storeSchema);
