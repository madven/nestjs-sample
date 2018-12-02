const axios = require('axios');
const faker = require('faker');

const IDEA_GENERATOR = 'https://appideagenerator.com/call.php';
const IDEA_API = 'http://localhost:4000';

const generateIdea = async () => {
  const { data } = await axios.get(IDEA_GENERATOR);
  return data.replace(/\n/g, '');
}

const generateUser = async () => {
  const username = await faker.internet.userName();
  const { data } = await axios.post(`${IDEA_API}/register`, {
    username,
    password: 'password',
  });
  return data.token;
}

const postNewIdea = async token => {
  const idea = await generateIdea();
  const description = await faker.lorem.paragraph();
  const { data } = await axios.post(`${IDEA_API}/api/ideas`,
    {
      idea,
      description
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return idea;
}

const randInt = () => Math.floor(Math.random() * 10);

(async () => {
  const userNum = randInt();
  console.log(userNum);
  const ideaNum = randInt();
  console.log(ideaNum);
  for (let i = 0; i < userNum; i++) {
    const token = await generateUser();
    for (let j = 0; j < ideaNum; j++) {
      await postNewIdea(token);
    }
  }
})();