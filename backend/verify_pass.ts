import * as bcrypt from 'bcrypt';

async function verify() {
  const hash = '$2b$10$qqNL0ZOdbMI7x93bQSTsau36iTaRE4PB6b7nrciC7YSkSCyLS7BDW';
  const pass = 'Password123!';
  const isMatch = await bcrypt.compare(pass, hash);
  console.log('Is match:', isMatch);
}

verify();
