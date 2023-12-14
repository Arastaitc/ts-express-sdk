# Typescript ile Express Backend Kurulumu

Bu rehber, Arasta projeleri için backend servislerini özelleştirmeye yönelik adım adım bir kılavuz sunmaktadır.

**Günün sonunda aşağıdaki özelliklere sahip bir backend servisi oluşturmuş olacaksınız:**

- TypeScript
- Linting
- Formatting
- Express
- CI/CD
- Testing
- Swagger (henüz eklenmedi)

## İçerik
- [Pnpm paketinin kurulumu](#pnpm-paketinin-kurulumu)
- [Package.json dosyasını düzenleyin](#packagejson-dosyasını-düzenleyin)
- [Vscode ve Prettier ayarlarını yapalım](#vscode-ve-prettier-ayarlarını-yapalım)
- [Typescript kurulumunu yapalım](#typescript-kurulumunu-yapalım)
- [Src klasörü oluşturalım ve düzenleyelim](#src-klasörü-oluşturalım-ve-düzenleyelim)
- [Şimdi `tsconfig.json` Dosyasını oluşturalım](#şimdi-tsconfigjson-dosyasını-oluşturalım)
- [`tsconfig.json` Dosyasını düzenleyin](#tsconfigjson-dosyasını-düzenleyin)
- [TypeScript Kodunu Derleyin](#typescript-kodunu-derleyin)
- [Projeye Eslint kurulumu](#projeye-eslint-kurulumu)
- [Eslint çalışıyor mu kontrol edelim](#eslint-çalışıyor-mu-kontrol-edelim)
- [Cross-Env ve Nodemon kurulumu](#cross-env-ve-nodemon-kurulumu)
- [Express Kurulumu](#express-kurulumu)
- [CI / CD İşlemleri](#ci--cd-işlemleri)

## Pnpm paketinin kurulumu

Bu adımda, global olarak pnpm paketini yükleyeceğiz.

```bash
sudo npm i -g pnpm@latest nodemon@latest
```

Klasör oluşturun ve ardından `package.json` dosyası oluşturun.

```bash
mkdir ts-express
cd ts-express
pnpm init
```

## Package.json dosyasını düzenleyin

`package.json` dosyasına bu satırları ekleyin.

```json
  "main": "./build/index.js"
```

`scripts` kısmını da şu şekilde düzenleyelim.

```json
 "scripts": {
    "dev": "npx nodemon",
    "build": "rimraf ./build && tsc",
    "start": "cross-env NODE_ENV=production npm run build && cross-env NODE_ENV=production node build/index.js",
    "lint": "eslint 'src/**/*.{ts,tsx}'",
    "fix": "prettier --write 'src/**/*.{ts,tsx}' && pnpm lint --fix",
    "test": "jest --forceExit --detectOpenHandles  --watchAll --maxWorkers=1 --coverage"
  },
```

## Vscode ve Prettier ayarlarını yapalım

VSCode'daki eklentiler panelinden `eslint` eklentisini kurun.

Ayrıca `prettier` paketini projeye kurmamız gerekiyor.

```bash
pnpm i prettier -D
```

`.prettierrc` adında bir dosya oluşturun ve şu şekilde düzenleyin

```json
{
    "printWidth": 100,
    "singleQuote": true,
    "trailingComma": "all"
}
```

`.prettierignore` adında bir dosya oluşturun ve şu şekilde düzenleyin

```bash
build
coverage
dist
docs
node_modules
```

Projenin ana dizininde `.vscode/settings.json` dosyasını oluşturun ve aşağıdaki şekilde düzenleyin

```json
{
  "editor.formatOnSave": true,
  "eslint.validate": ["typescript"]
}
```

## Typescript kurulumunu yapalım

Bu adımda, projeye TypeScript ve gerekli diğer paketleri ekleyeceğiz.

```bash
pnpm i typescript ts-node @types/node -D
```

## Src klasörü oluşturalım ve düzenleyelim

Öncelikle `dotenv` kurulumu yapmamız gerekiyor.

```bash
pnpm i dotenv
```

Projenin ana dizininde 3 adet .env dosyası oluşturalım.

```
touch .env.development 
touch .env.production
touch .env.test
```

`.env` dosyalarını aşağıdaki şekilde güncelle

```env
MONGODB_URI=
PORT= 2000 # bu dosyaların üçününde portlarını değiştirmeden bir sonraki adıma GEÇMEYİN!
```

Şimdi ise `src/index.ts` yolunda ilk TypeScript dosyanızı oluşturun.

```bash
mkdir src
touch src/index.ts
```

Gerekli `dotenv` konfigürasyonunu `src/index.ts` içinde yapalım.

```js
import dotenv from "dotenv";

// Configuration
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
```

## Şimdi `tsconfig.json` Dosyasını oluşturalım

`tsconfig.json` dosyasını oluşturmak için aşağıdaki terminal komutunu yazalım.

```bash
npx tsc --init
```

## `tsconfig.json` Dosyasını düzenleyin

Oluşturduğunuz `tsconfig.json` dosyasını tamamen bu şekilde düzenleyin.

```json
{
  "exclude": [
    "node_modules",
    "./build",
    "./coverage",
    "__test__",
    "./.vscode",
    "./.github",
    "jest.setup.js",
    "jest.config.js"
  ],
  "ts-node": {
    "transpileOnly": true,
    "files": true
  },
  "compilerOptions": {
    "target": "es2016",
    "lib": ["es6"],
    "module": "commonjs",
    "rootDir": "src",
    "resolveJsonModule": true,
    "checkJs": true,
    "allowJs": true,
    "outDir": "build",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitAny": true,
    "skipLibCheck": true
  }
}

```

## TypeScript Kodunu Derleyin

TypeScript kodunuzu derlemek için aşağıdaki komutu kullanın.

```bash
npx tsc
```

Derledikten sonra `build` adında bir klasör görmelisiniz.

Bu kısma kadar her şey tamamsa haydi devam edelim 💪

## Projeye Eslint kurulumu

Eslint eklentimizi ve eslint'i aşağıdaki komutları kullanarak kurun.

```bash
pnpm i eslint @arastaitc/eslint-config-base-typescript -D
```

Daha sonra ana dizinde `.eslintrc` dosyası oluşturun ve içeriğini şu şekilde düzenleyin.

```json
{
  "root": true,
  "extends": ["@arastaitc/eslint-config-base-typescript"],
  "rules": {
    "import/no-extraneous-dependencies": "off"
  }
}
```

`.eslintignore` dosyası oluşturun ve içeriğini şu şekilde düzenleyin.

```bash
node_modules
dist
build
.github
.env.development
.env.production
__test__
jest.setup.js
```

### Eslint çalışıyor mu kontrol edelim.

`src/index.ts` dosyasını aşağıdaki şekilde güncelleyin.

```js
import dotenv from 'dotenv';

// Configuration
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

console.log("test eslint");
```

Aşağıdaki kod ile çalıştığını test edin.

```bash
pnpm lint
```

Eğer console uyarısı verirse başardınız 💯

Haydi sonraki adıma geçelim 🥳




## Cross-Env ve Nodemon kurulumu
öncelikle paketleri kuralım
```bash
pnpm i -D cross-env nodemon rimraf
```

daha sonra proje dizininde `nodemon.json` dosyası oluşturun ve bu şekilde düzenleyin.
```json
{
  "watch": ["src"],
  "ext": ".ts,.js",
  "ignore": [],
  "exec": "cross-env NODE_ENV=development npx ts-node ./src/index.ts"
}

```



## Express Kurulumu

önce gereken paketleri kuralım
```bash
pnpm i express compression helmet cors 
```

ayrıca type paketlerinide kurmamız gerekiyor
```bash
pnpm i -D @types/express @types/compression @types/cors
````

`src/index.ts` dosyasının son hali aşağıdaki gibi olacak.
```js


import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';

// Configuration
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();

app.disable('x-powered-by');
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(express.json());
app.use(helmet());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

try {
  if (!process.env.PORT) {
    throw new Error('Lütfen .env dosyasını kontrol ediniz. PORT değeri bulunamadı.');
  }

  app.listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[ArastaTS] developer için hazır!, port: ${process.env.PORT}`);
  });
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(error);
}

export default app;

```

## CI / CD İşlemleri 
projenin ana dizininde `.github/workflows/` dizini altında `node.yml` dosyası oluşturun.

`.github/workflows/node.yml` dosyası içeriğini aşağıdaki gibi düzenleyin.
```yml
name: Arasta-TS-Express
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Nodejs 18
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint
      - run: npm run build --if-present
  
``` 

## Test'leri dahil edelim
Şimdi geldik test kodları için test altyapısını oluşturmaya :)

birkaç kurulum yapalım

```bash
pnpm i -D jest supertest ts-jest @types/supertest @types/jest
npx ts-jest config:init
```

Projenin ana dizininde `jest.setup.js` oluşturun ve içeriğine dotenv ekleyin.
```js
require('dotenv').config({ path: '.env.test' });
```

Daha sonra ana dizinde `__test__` adında klasör oluşturalım ve içerisine `server.test.ts` dosyası oluşturalım.

`server.test.ts` dosyasının içeriğini oluşturun.
```js
import request from 'supertest';
import app from '../src/index';

beforeAll(async () => {
  // 3 saniye bekle
  await new Promise((resolve) => setTimeout(resolve, 3000));
});

describe('Arasta-Express-Ts', () => {
  it('check service status /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  it('should respond with status 404 for unknown routes', async () => {
    const response = await request(app).get('/nonexistent-route');
    expect(response.status).toBe(404);
  });
});
```
Şimdi test komutunu yazdığımızda, projenin jest ile test edilmesi gerekiyor ve testlerin başarıyla geçmesi gerekiyor.

test etmek için 

```bash
pnpm test
```
