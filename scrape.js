const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // Set headless to true for headless mode
  const page = await browser.newPage();
  
  try {
    await page.goto('https://www.linkedin.com/jobs/search/?currentJobId=3960300799&geoId=101834488&keywords=MLOps&origin=JOB_SEARCH_PAGE_SEARCH_BUTTON&refresh=true');
    
    await page.waitForSelector('.search-bar__full-placeholder', { timeout: 60000 });

    const jobs = await page.evaluate(() => {
      const jobElements = document.querySelectorAll('.jobs-search__results-list ul');
      const jobData = {};

      jobElements.forEach(job => {
        const title = job.querySelector('.job-card-list__title')?.innerText.trim();
        console.log(title);
        const company = job.querySelector('.job-details-jobs-unified-top-card__company-name')?.innerText.trim();
        console.log(company);
        const location = job.querySelector('.job-search-card__subtitle a')?.innerText.trim();
        console.log(location);
        const description = job.querySelector('.jobs-description__details')?.innerText.trim();console.log(title);
        console.log(description);
        const postDate = job.querySelector('.t-normal')?.innerText.trim();
        console.log(postDate);
        const skills = job.querySelector('.job-flavors__list')?.innerText.trim();
        console.log(skills);
        const link = job.querySelector('.job-card-container__apply-button-link')?.getAttribute('href');
        console.log(link);

        if (title && company && location && description && postDate && skills && link) {
          const jobKey = `${title} at ${company}`;
          jobData[jobKey] = { title, company, location, description, postDate, skills, link };
        }
      });

      return jobData;
    });

    // Write the job data to a JSON file
    fs.writeFileSync('linkedin_jobs.json', JSON.stringify(jobs, null, 2));
    console.log('Job data saved to linkedin_jobs.json');

  } catch (error) {
    console.error('Error waiting for selector or extracting data:', error);
  } finally {
    // Close browser
    // await browser.close();
  }
})();