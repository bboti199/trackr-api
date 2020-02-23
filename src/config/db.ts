import mongoose from 'mongoose';

export default (url: string) => {
  const connect = () => {
    mongoose
      .connect(url, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
      })
      .then(() => {
        return console.log('Connected to the database!');
      })
      .catch(err => {
        console.error(err);
        return process.exit(1);
      });
  };

  connect();

  mongoose.connection.on('disconnect', connect);
};
