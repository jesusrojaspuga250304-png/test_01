const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
let base = (process.env.TEST_URL || '').replace(/\/$/,'');
const pages=['index.html','catalogo.html','empresas.html','guias.html','nosotros.html','contacto.html','producto.html?id=creative','guia-licencias.html','guia-compatibilidad.html','guia-implementacion.html'];
(async()=>{
  let server;
  if(!base){
    const root = path.resolve(__dirname,'..');
    server = http.createServer((request,response)=>{
      const pathname = decodeURIComponent(new URL(request.url,'http://localhost').pathname);
      const target = path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
      if(!target.startsWith(root+path.sep)){response.writeHead(403).end();return;}
      fs.readFile(target,(error,data)=>{
        if(error){response.writeHead(404).end();return;}
        const type={'.html':'text/html','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml'}[path.extname(target)] || 'application/octet-stream';
        response.writeHead(200,{'Content-Type':type+'; charset=utf-8'}).end(data);
      });
    });
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    base='http://127.0.0.1:'+server.address().port;
  }
  const browser=await chromium.launch({headless:true,...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{})});
  try {
    const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    for(const width of [1440,768,390,320]){
      await page.setViewportSize({width,height:900});
      for(const route of pages){
        const response=await page.goto(base+'/'+route,{waitUntil:'networkidle'});
        assert.equal(response.status(),200,route);
        assert.equal(await page.locator('h1').count(),1,route+' h1');
        assert.ok((await page.title()).includes('Codalvia'));
        assert.equal(await page.locator('#navigation [aria-current="page"]').count(),route==='index.html'?0:1,'Active navigation '+route);
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route+' overflow '+width);
        assert.equal(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0,'Reduced motion '+route);
        if(width===1440){
          const links=await page.locator('a[href]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
          for(const href of links){
            if(href.startsWith('#')){assert.equal(await page.locator(href).count(),1,route+' anchor '+href);continue;}
            const file=href.split(/[?#]/)[0];
            assert.ok(fs.existsSync(path.join(__dirname,'..',file)),route+' broken link '+href);
          }
        }
      }
    }
    await page.setViewportSize({width:1440,height:1000});
    await page.goto(base+'/catalogo.html?publico=business&categoria=Gestión');
    assert.equal(await page.locator('.product').count(),1);
    await page.goto(base+'/catalogo.html?categoria=INVALID&publico=INVALID');
    assert.equal(await page.locator('.product').count(),6);
    await page.locator('#search').fill('proteccion');
    assert.equal(await page.locator('.product').count(),1);
    await page.locator('#search').fill('zzzz-no-result');
    assert.equal(await page.locator('#empty').isVisible(),true);
    await page.locator('#reset').click();
    await page.getByRole('button',{name:'Para ti',exact:true}).click();
    assert.equal(await page.locator('.product').count(),5);
    await page.getByRole('button',{name:'Todo el software',exact:true}).click();
    await page.locator('#sort').selectOption('name');
    assert.equal(await page.locator('.product h3').first().textContent(),'Gestión de negocio');
    for(const id of ['creative','office','security']) await page.locator('[data-compare="'+id+'"]').check();
    await page.locator('[data-compare="dev"]').click();
    assert.equal(await page.locator('[data-compare="dev"]').isChecked(),false);
    await page.locator('#compare-open').click();
    assert.equal(await page.locator('thead th').count(),4);
    await page.keyboard.press('Escape');
    await page.locator('[data-detail="creative"]').click();
    await page.waitForURL('**/producto.html?id=creative');
    await page.locator('#add-selection').click();
    assert.equal(await page.locator('#selection-count').textContent(),'1');
    await page.goBack();
    assert.equal(await page.locator('#selection-count').textContent(),'1');
    await page.goto(base+'/empresas.html');
    await page.locator('.business a.button').click();
    await page.waitForURL('**/contacto.html?tipo=empresa');
    assert.equal(await page.locator('[name="type"]').inputValue(),'Empresa');
    assert.ok((await page.locator('#contact-selection').textContent()).includes('Suite creativa'));
    await page.locator('[name="users"]').fill('5');
    await page.locator('[name="needs"]').fill('Proyecto <script>alert(1)</script>');
    await page.getByRole('button',{name:'Generar resumen'}).click();
    assert.ok((await page.locator('.summary-text').textContent()).includes('<script>alert(1)</script>'));
    assert.equal(await page.locator('#modal-body script').count(),0);
    const download=page.waitForEvent('download');
    await page.locator('#download-summary').click();
    assert.equal((await download).suggestedFilename(),'consulta-codalvia.txt');
    await page.keyboard.press('Escape');
    await page.locator('#selection-open').click();
    await page.locator('[data-remove="creative"]').click();
    assert.equal(await page.locator('#selection-count').textContent(),'0');
    await page.keyboard.press('Escape');
    await page.goto(base+'/producto.html?id=missing');
    assert.ok((await page.locator('h1').textContent()).includes('No encontramos'));
    await page.setViewportSize({width:390,height:844});
    await page.goto(base+'/index.html');
    await page.locator('#menu-toggle').click();
    assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'true');
    await page.locator('#navigation a[href="guias.html"]').click();
    await page.waitForURL('**/guias.html');
    assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false');
    await page.locator('a[href="guia-licencias.html"]').click();
    await page.waitForURL('**/guia-licencias.html');
    assert.equal(await page.locator('.reading-body section').count(),4);
    await page.goto(base+'/index.html');
    await page.screenshot({path:path.join(os.tmpdir(),'codalvia-mobile.png')});
    await page.setViewportSize({width:1440,height:1000});
    for(const route of ['index.html','contacto.html','producto.html?id=creative']){
      await page.goto(base+'/'+route);
      await page.screenshot({path:path.join(os.tmpdir(),'codalvia-'+route.split('.')[0]+'.png'),fullPage:true});
    }
    // Animate a real reveal, then switch OS preference while the page is open.
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.setViewportSize({width:390,height:844});
    await page.goto(base+'/index.html');
    assert.ok((await page.locator('main').evaluate(e=>getComputedStyle(e).animationName)).includes('page-enter'));
    const reveal=page.locator('.reveal').first();
    await reveal.scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>document.querySelector('.reveal')?.classList.contains('is-visible'));
    await page.emulateMedia({reducedMotion:'reduce'});
    assert.equal(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0);
    assert.deepEqual(errors,[]);
    console.log('PASS: 10 pages at 1440/768/390/320px; links, headings, navigation, filtering, comparison, cross-page selection, detail routing, safe inquiry/download, reduced motion and reveal animations.');
  } finally {await browser.close();if(server) await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exit(1)});
