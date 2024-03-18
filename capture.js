const puppeteer = require('puppeteer');
const { ImgurClient } = require('imgur');
const fs = require('fs');

const buildNumber = process.argv[2];

const client = new ImgurClient({ clientId: "a355bf1c455a135" }); // Substitua pelo seu Client ID do Imgur

async function captureScreenshotAndUpload() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:8080/login'); // Página de login do Jenkins
    
    // Preencher formulário de login
    await page.type('#j_username', 'raphaelbaere'); // Substitua 'seu-usuario' pelo nome de usuário do Jenkins
    await page.type('#j_password', '1598746230A'); // Substitua 'sua-senha' pela senha do Jenkins
    await page.click('form[name="login"] > button[type="submit"]'); // Enviar formulário de login

    await page.goto(`http://localhost:8080/job/chronos-qa-api-pipeline/${buildNumber}/allure/`);
    // Ir para a página do relatório Allure após o login
    await page.setViewport({
        width: 1920, // Largura da tela
        height: 1080, // Altura da tela
    });

    // Capturar a screenshot da página
    await page.screenshot({ path: 'screenshot.png' });

    // Fazer upload da captura de tela para o Imgur
    const response = await client.upload({
        image: fs.createReadStream('C:/Users/rapha/screenshot.png'),
        type: 'stream',
      });
      console.log(response.data.link);

    await browser.close();

    return response.data.link;
}

captureScreenshotAndUpload();