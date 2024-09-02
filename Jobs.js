import axios from 'axios';
import * as cheerio from 'cheerio';  
import * as XLSX from 'xlsx';

async function scrapeJobs() {
    try {
        // Fetching the HTML from the jobs URL
        const result = await axios.get('https://www.timesjobs.com/candidate/job-search.html?searchType=Home_Search&from=submit&asKey=OFF&txtKeywords=&cboPresFuncArea=35');
        
        // Loading the HTML content to cheerio for parsing
        const $ = cheerio.load(result.data);
        
        // Array to store the extracted job data
        const jobs = [];

        // Loop through each job listing card
        $('li.clearfix.job-bx').each((index, element) => {
            const jobTitle = $(element).find('h2 a').text().trim();
            const companyName = $(element).find('h3.joblist-comp-name').text().trim();
            const experience = $(element).find('.top-jd-dtl li:nth-child(1)').text().trim();
            const salary = $(element).find('.top-jd-dtl li:nth-child(2)').text().trim();
            const location = $(element).find('.top-jd-dtl li:nth-child(3)').text().trim() || 'Not Specified';
            const jobDescription = $(element).find('li:contains("Job Description")').text().replace('Job Description:', '').trim();
            const postedDate = $(element).find('.sim-posted span').text().trim();

            // Pushing the data into the jobs array
            jobs.push({
                Job_Title: jobTitle,
                Company_Name: companyName,
                Experience: experience,
                Salary: salary,
                Location: location,
                Posted_Date: postedDate,
                Job_Description: jobDescription
            });
        });
        // Writing the extracted data to an Excel file
        const worksheet = XLSX.utils.json_to_sheet(jobs);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Jobs');

        // Write the workbook to an Excel file
        XLSX.writeFile(workbook, 'jobs_data.xlsx');
        console.log('Excel file successfully written: jobs_data.xlsx');
        
    } catch (error) {
        console.error('Error:', error);
    }
}

scrapeJobs();
