import { test, expect } from '@playwright/test';
import exp from 'constants';

test("wireframe", async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toBeAttached();
  await expect(page.getByPlaceholder('Search here')).toBeVisible();
  await expect(page.getByRole('list').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Radio Browser' })).toBeAttached();
  await expect(page.getByText('FAVORITE RADIOS')).toBeAttached();
  await expect(page.getByText("Search stations")).toBeAttached();
  await expect(page.getByRole('list').last()).toBeAttached();
});

async function mockFirstStations(page) {
  return await page.route('*/**/json/stations/search*', async route => {
    const json = [
      {stationuuid: 'MPB', name: 'MPB', tags: ""},
      {stationuuid: 'sertanejo-brasil', name: 'Sertanejo Brasil', tags: "Brasil,RJ"},
      {stationuuid: 'radio-fm', name: 'Rádio FM', tags: "Brasil,FM"},
      {stationuuid: 'radio-sertanejo-so-modao', name: 'Radio Sertanejo Só Modão', tags: "moda,moda de viola,modao,sertanejo"},
      {stationuuid: 'bossa-nova-brasil', name: 'Bossa Nova Brasil', tags: ""},
      {stationuuid: 'gaucha', name: 'Gaúcha', tags: ""},
      {stationuuid: 'sertanejo-brasil2', name: 'Sertanejo Brasil', tags: ""},
      {stationuuid: 'radio-jovem-pan', name: 'Rádio Jovem Pan', tags: ""},
      {stationuuid: 'novo-tempo', name: 'Novo Tempo', tags: ""}
    ];
    await route.fulfill({ json });
  });
}

function getRadioList(page){
  return page.getByRole('list').first();
}

function getFavoritesList(page){
  return page.getByRole('list').last();
}

test("initial fetch of radio stations", async ({ page }) => {
  await mockFirstStations(page);
  await page.goto('/');

  const radioList = getRadioList(page);
  await expect(radioList.getByRole('listitem')).toHaveCount(10, { timeout: 15000 });
  const firstRadio = radioList.getByRole('listitem').filter({ hasText: 'MPB' });
  await expect(firstRadio).toBeVisible();
  const lastRadio = radioList.getByRole('listitem').filter({ hasText: 'Novo Tempo' });
  await expect(lastRadio).toBeAttached();
});

test("add stations to favorite list, view and remove them", async ({page}) => {
  await mockFirstStations(page);
  await page.goto('/');

  const radioList = getRadioList(page);
  await expect(radioList.getByRole('listitem')).toHaveCount(10, { timeout: 15000 });

  for(let radioIndex = 0; radioIndex < 9; radioIndex++){
    await radioList.getByRole('listitem').nth(radioIndex).click();
  }

  const favoritesList = getFavoritesList(page);
  await expect(favoritesList.getByRole('listitem')).toHaveCount(9);
  const firstRadio = favoritesList.getByRole('listitem').filter({ hasText: 'MPB' });
  await expect(firstRadio).toBeAttached();
  const lastRadio = favoritesList.getByRole('listitem').filter({ hasText: 'Novo Tempo' });
  await expect(lastRadio).toBeAttached();

  for(let radioIndex = 0; radioIndex < 9; radioIndex++){
    await radioList.getByRole('listitem').nth(radioIndex).click();
  }
  
  await expect(favoritesList.getByRole('listitem')).toHaveCount(0);
});

test("open and close sidebar", async ({page}) => {
  await page.goto('/');

  const closeSidebarButton = page.locator('i').first();
  await expect(closeSidebarButton).toBeVisible();
  await closeSidebarButton.click();
  await expect(closeSidebarButton).not.toBeVisible();

  await page.locator('div').filter({ hasText: 'Radio Browser' }).last().locator('i').first().click();
  await expect(closeSidebarButton).toBeVisible();
  await closeSidebarButton.click();
});

test("remove favorite stations by clicking on the remove button", async ({page}) => {
  await mockFirstStations(page);
  await page.goto('/');

  const radioList = getRadioList(page);
  await expect(radioList.getByRole('listitem')).toHaveCount(10, { timeout: 15000 });

  for(let radioIndex = 0; radioIndex < 9; radioIndex++){
    await radioList.getByRole('listitem').nth(radioIndex).click();
  }

  await page.locator('i').first().click();

  const favoritesList = getFavoritesList(page);
  await expect(favoritesList.getByRole('listitem')).toHaveCount(9);

  let favoriteRadio;
  for(let radioIndex = 8; radioIndex >= 0; radioIndex--){
    favoriteRadio = favoritesList.getByRole('listitem').nth(radioIndex);
    await favoriteRadio.hover();
    await favoriteRadio.locator('i').last().click();
  }
  
  await expect(favoritesList.getByRole('listitem')).toHaveCount(0);
});

test("persist favorite stations", async ({page}) => {
  await mockFirstStations(page);
  await page.goto('/');

  const radioList = getRadioList(page);
  await expect(radioList.getByRole('listitem')).toHaveCount(10, { timeout: 15000 });

  for(let radioIndex = 0; radioIndex < 9; radioIndex++){
    await radioList.getByRole('listitem').nth(radioIndex).click();
  }

  let storedFavorites = await page.evaluate(() => {
    return localStorage.getItem('favorites');
  });

  expect(JSON.parse(storedFavorites)).toHaveLength(9);
  expect(storedFavorites).toContain('MPB');
  expect(storedFavorites).toContain('Novo Tempo');

  await page.reload();

  let favoritesList = getFavoritesList(page);
  await expect(favoritesList.getByRole('listitem')).toHaveCount(9);

  for(let radioIndex = 0; radioIndex < 9; radioIndex++){
    await radioList.getByRole('listitem').nth(radioIndex).click();
  }
  
  storedFavorites = await page.evaluate(() => {
    return localStorage.getItem('favorites');
  });
  expect(JSON.parse(storedFavorites)).toHaveLength(0);

  await page.reload();
  favoritesList = getFavoritesList(page);
  await expect(favoritesList.getByRole('listitem')).toHaveCount(0);
});

test("search by name", async ({page}) => {
  await page.route('*/**/json/stations/search*', async route => {
    const json = require('./antena.mock.json');
    await route.fulfill({ json });
  });
  await page.goto('/');

  const searchField = page.getByPlaceholder('Search here');
  await expect(searchField).toHaveValue('');
  await searchField.fill('antena');
  await page.waitForTimeout(1000);
  await expect(page.getByText('antena')).toHaveCount(10);
});

test("search by tags", async ({page}) => {
  await page.route('*/**/json/stations/search*', async route => {
    const json = require('./samba.mock.json');
    await route.fulfill({ json });
  });
  await page.goto('/');

  const searchField = page.getByPlaceholder('Search here');
  await expect(searchField).toHaveValue('');
  await searchField.fill('samba');
  await page.waitForTimeout(1000);

  const radioList = getRadioList(page);
  await expect(radioList.getByRole('listitem')).toHaveCount(11, { timeout: 15000 });
  for(let radioIndex = 0; radioIndex < 10; radioIndex++){
    await radioList.getByRole('listitem').nth(radioIndex).click();
  }

  await expect(getRadioList(page)).not.toContainText('samba');

  const closeSidebarButton = page.locator('i').first();
  await closeSidebarButton.click();

  await expect(getFavoritesList(page)).toContainText('samba');
});

test("search by country", async ({page}) => {
  await page.route('*/**/json/stations/search*', async route => {
    const json = require('./tchequia.mock.json');
    await route.fulfill({ json });
  });
  await page.goto('/');

  const searchField = page.getByPlaceholder('Search here');
  await expect(searchField).toHaveValue('');
  await searchField.fill('czechia');
  await page.waitForTimeout(1000);

  const radioList = getRadioList(page);
  await expect(radioList.getByRole('listitem')).toHaveCount(11, { timeout: 15000 });
  for(let radioIndex = 0; radioIndex < 10; radioIndex++){
    await radioList.getByRole('listitem').nth(radioIndex).click();
  }

  await expect(getRadioList(page)).not.toContainText('czechia');

  const closeSidebarButton = page.locator('i').first();
  await closeSidebarButton.click();

  await expect(getFavoritesList(page)).not.toContainText('czechia');
});

test("search by countrycode", async ({page}) => {
  await page.route('*/**/json/stations/search*', async route => {
    const json = require('./macedonia.mock.json');
    await route.fulfill({ json });
  });
  await page.goto('/');

  const searchField = page.getByPlaceholder('Search here');
  await expect(searchField).toHaveValue('');
  await searchField.fill('MK');
  await page.waitForTimeout(1000);

  const radioList = getRadioList(page);
  await expect(radioList.getByRole('listitem')).toHaveCount(11, { timeout: 15000 });
  for(let radioIndex = 0; radioIndex < 10; radioIndex++){
    await radioList.getByRole('listitem').nth(radioIndex).click();
  }

  await expect(getRadioList(page)).not.toContainText('MK');

  const closeSidebarButton = page.locator('i').first();
  await closeSidebarButton.click();

  await expect(getFavoritesList(page)).not.toContainText('MK');
});

test("search by language", async ({page}) => {
  await page.route('*/**/json/stations/search*', async route => {
    const json = require('./brazil.mock.json');
    await route.fulfill({ json });
  });
  await page.goto('/');

  const searchField = page.getByPlaceholder('Search here');
  await expect(searchField).toHaveValue('');
  await searchField.fill('pt-br');
  await page.waitForTimeout(1000);

  const radioList = getRadioList(page);
  await expect(radioList.getByRole('listitem')).toHaveCount(4, { timeout: 15000 });
  for(let radioIndex = 0; radioIndex < 3; radioIndex++){
    await radioList.getByRole('listitem').nth(radioIndex).click();
  }

  await expect(getRadioList(page)).not.toContainText('pt-br');

  const closeSidebarButton = page.locator('i').first();
  await closeSidebarButton.click();

  await expect(getFavoritesList(page)).not.toContainText('pt-br');
});

test("editing favorite station", async ({page}) => {
  await mockFirstStations(page);
  await page.goto('/');

  const radioList = getRadioList(page);
  await expect(radioList.getByRole('listitem')).toHaveCount(10, { timeout: 15000 });

  for(let radioIndex = 0; radioIndex < 9; radioIndex++){
    await radioList.getByRole('listitem').nth(radioIndex).click();
  }

  await page.locator('i').first().click();

  const favoritesList = getFavoritesList(page);
  await expect(favoritesList.getByRole('listitem')).toHaveCount(9);

  const favoriteRadio = favoritesList.getByRole('listitem').last();
  await favoriteRadio.hover();
  await favoriteRadio.locator('i').nth(2).click();

  await page.keyboard.down('Shift');
  await page.keyboard.press('Home');
  await page.keyboard.up('Shift');
  await page.keyboard.press('Delete');
  await expect(page.getByRole('textbox').first()).toHaveValue("");
  await page.keyboard.press('Enter');
  await expect(page.getByRole('textbox')).toHaveCount(0);

  await favoriteRadio.hover();
  await favoriteRadio.locator('i').nth(2).click();
  await page.keyboard.press('Tab');
  await page.keyboard.insertText('em branco');
  await expect(page.getByRole('textbox').last()).toHaveValue('em branco');
  await favoriteRadio.locator('i').nth(3).click();
  await expect(favoritesList).toContainText('em branco');

  await favoriteRadio.hover();
  await favoriteRadio.locator('i').nth(2).click();
  await page.getByRole('textbox').first().fill('Contradição');
  await page.getByText('Radio Browser').click();

  await page.reload();

  let storedFavorites = await page.evaluate(() => {
    return localStorage.getItem('favorites');
  });

  expect(storedFavorites).toContain('Contradição');
  expect(storedFavorites).toContain('em branco');
});

test('pagination', async ({page}) => {
  await page.route('*/**/json/stations/search*', async route => {
    const json = require('./stations.mock.json');
    await route.fulfill({ json });
  });
  await page.goto('/');

  const paginationDiv = getRadioList(page).getByRole('listitem').last();
  await expect(paginationDiv).toContainText('1/45');
  await expect(getRadioList(page)).toContainText('Antena');
  await paginationDiv.locator('i').nth(2).click();
  await expect(paginationDiv).not.toContainText('1/45');
  await expect(getRadioList(page)).toContainText('Antena');
  await paginationDiv.locator('i').nth(2).click();
  await expect(getRadioList(page)).toContainText('Rio de Janeiro');
  await expect(paginationDiv).toContainText('3/45');
  await expect(getRadioList(page)).toContainText('Portugal');
  await paginationDiv.locator('i').nth(1).click();
  await expect(paginationDiv).toContainText('2/45');
  await expect(getRadioList(page)).toContainText('São Paulo');
  await paginationDiv.locator('i').nth(3).click();
  await expect(paginationDiv).toContainText('45/45');
  await expect(getRadioList(page)).toContainText('Georgian');
  await paginationDiv.locator('i').nth(0).click();
  await expect(paginationDiv).toContainText('1/45');
  await expect(getRadioList(page)).toContainText('Porto Alegre');
});