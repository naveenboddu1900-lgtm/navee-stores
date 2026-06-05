function mediaUploadPlaceholder(fileName) {
  return {
    provider: 'demo',
    url: `https://placehold.co/900x700/0f766e/ffffff?text=${encodeURIComponent(fileName || 'NAVEE')}`
  };
}

module.exports = { mediaUploadPlaceholder };
