const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs-extra');

const app = express();
const port = 3000; //5061  3000

app.use(bodyParser.text());

app.post('/compile', (req, res) => {
  // Get the Java code from the request body
  const javaCode = req.body;

  // Save the Java code to DFPlugin.java
  fs.writeFileSync('DFPlugin.java', javaCode);

  // Run Maven to install dependencies and compile the code
  const mavenProcess = exec('"maven/bin/mvn" clean package shade:shade');
  
  // Stream the Maven process output to the console in real-time
  mavenProcess.stdout.pipe(process.stdout);
  mavenProcess.stderr.pipe(process.stderr);

  mavenProcess.on('close', (code) => {
    if (code === 0) {
      console.log('Compilation successful');
      res.status(200).send('Compilation successful');
    } else {
      console.error(`Compilation failed with exit code ${code}`);
      res.status(500).send(`Compilation failed with exit code ${code}`);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
