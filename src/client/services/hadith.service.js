import axios from "axios"

export async function getHadith() {
    const books = ["abudawud", "bukhari", "ibnmajah", "muslim", "malik", "tirmidhi", "nasai"]

    const selectedBook = books[Math.floor((Math.random() * books.length))]


    let englishHadith = await fetchWithFallback([
        "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-",
        "https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions/eng-",
    ], selectedBook)
    let arabicHadith = await fetchWithFallback([
        "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-",
        "https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions/ara-",
    ], selectedBook)
    const randomNum = Math.floor(Math.random() * englishHadith.hadiths.length)



    return [englishHadith.hadiths[randomNum], arabicHadith.hadiths[randomNum], selectedBook + " | " + englishHadith.metadata.sections[englishHadith.hadiths[randomNum].reference.book.toString()]]
}

const fetchWithFallback = async (links, selectedBook) => {
    const axiosObj = axios.create()
    let response;
    for (let link of links) {
        try {
            response = await axiosObj
                .get(`${link}${selectedBook}.min.json`)

            return response.data

        } catch (e) {
            console.log("err")
        }
    }
    return response
}
