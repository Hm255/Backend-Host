const app = require('./app')
const { PORT = 3000 } = process.env;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on ${PORT}...`);
});
