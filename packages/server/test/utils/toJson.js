function toJson(value) {
  if (typeof value === 'string') {
    return JSON.parse(value);
  } else {
    return value;
  }
}

export default toJson;