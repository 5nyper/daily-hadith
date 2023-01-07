import axios from "axios"

export async function getHadith() {
    const books = ["abudawud", "bukhari", "ibnmajah", "muslim", "mailik", "tirmidhi", "nasai"]
    const axiosObj = axios.create()

    const selectedBook = books[Math.floor((Math.random() * books.length))]


    let englishHadith = await axiosObj
        .get(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-${selectedBook}.json`)
        .then((responseBody) => {
            return responseBody.data
        })
    let arabicHadith = await axiosObj
        .get(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-${selectedBook}.json`)
        .then((responseBody) => {
            return responseBody.data
        })
    const randomNum = Math.floor(Math.random() * englishHadith.hadiths.length)



    return [englishHadith.hadiths[randomNum], arabicHadith.hadiths[randomNum], selectedBook + " | " + englishHadith.metadata.sections[englishHadith.hadiths[randomNum].reference.book.toString()]]
}
