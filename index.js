const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'medlineplus',
        address: 'https://medlineplus.gov/healthtopics.html',
        base: ''
    },
    {
        name: 'healthline',
        address: 'https://www.healthline.com/',
        base: ''
    },
    {
        name: 'nih',
        address: 'https://www.nih.gov/health-information',
        base: '',
    },
    {
        name: 'diabetes',
        address: 'https://www.diabetes.org/',
        base: '',
    },
    {
        name: 'drugs',
        address: 'https://www.drugs.com/',
        base: '',
    },
    {
        name: 'familydoctor',
        address: 'https://familydoctor.org/',
        base: '',
    },
    {
        name: 'menshealth',
        address: 'https://www.menshealth.com/',
        base: '',
    },
    {
        name: 'kidshealth',
        address: 'https://kidshealth.org/',
        base: '',
    },
    {
        name: 'weightwatchers',
        address: 'https://www.weightwatchers.com/us/',
        base: '',
    },
    {
        name: 'ndtv',
        address: 'https://food.ndtv.com/health',
        base: '',
    }
    
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Health")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name,
                  

                })
            })

        })
})

app.get('/', (req, res
    ) => {
    res.json('Welcome to my Climate Change News API')
})

app.get('/news', (req, res) => {
    res.set({"Access-Control-Allow-Origin" : "*"})
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("Health")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))