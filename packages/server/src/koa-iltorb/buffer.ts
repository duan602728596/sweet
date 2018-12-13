function buffer(data: string): Buffer{
  // @ts-ignore
  return 'from' in Buffer ? Buffer.from(data) : new Buffer(data);
}

export default buffer;