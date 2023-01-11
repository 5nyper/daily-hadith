import React, { useEffect, useState, useRef } from 'react';
import styles from './styles.css';
import { getHadith } from '../../services/hadith.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRefresh } from '@fortawesome/free-solid-svg-icons'
import { faChevronCircleLeft, faChevronCircleRight, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import Switch from 'react-ios-switch';

const { ipcRenderer } = window.require('electron');

const App = () => {
  const [dailyHadith, setDailyHadith] = useState({ english: { text: '' }, arabic: {}, book: '' })
  const [isArabic, setIsArabic] = useState(false);
  const [gradeIndex, setGradeIndex] = useState(0);
  const $circle = useRef(null);
  const $smallCircle = useRef(null);
  const $card = useRef(null);
  const $cardOrangeShine = useRef(null);
  const $cardHadith = useRef(null);
  const $cardComet = useRef(null);

  useEffect(() => {
    if (dailyHadith.english.text) {
      ipcRenderer.send('UPDATE_TITLE', `${formatBookTitle(dailyHadith.book)}:${dailyHadith.english.arabicnumber}`);
      console.log(`https://sunnah.com/${dailyHadith.book}:${dailyHadith.english.arabicnumber}`)
    }
  }, [dailyHadith])

  async function getData() {
    let res = await getHadith()
    console.log(res)
    setDailyHadith({ english: res[0], arabic: res[1], book: res[2] })
    setGradeIndex(0)
  }

  useEffect(() => {
    ipcRenderer.on('REFRESH', (event, data) => getData());
    getData();
    const circle = $circle.current
    const smallCircle = $smallCircle.current
    const card = $card.current
    const cardOrangeShine = $cardOrangeShine.current
    const cardHadith = $cardHadith.current
    const cardComet = $cardComet.current

    const generateTranslate = (el, e, value) => {
      el.style.transform = `translate(${e.clientX * value}px, ${e.clientY * value}px)`;
    }
    // http://stackoverflow.com/a/1480137
    const cumulativeOffset = (element) => {
      var top = 0, left = 0;
      do {
        top += element.offsetTop || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
      } while (element);

      return {
        top: top,
        left: left
      };
    };
    document.onmousemove = (event) => {
      const e = event || window.event;
      const x = (e.pageX - cumulativeOffset(card).left - (350 / 2)) * -1 / 100;
      const y = (e.pageY - cumulativeOffset(card).top - (350 / 2)) * -1 / 100;

      const matrix = [
        [1, 0, 0, -x * 0.00005],
        [0, 1, 0, -y * 0.00005],
        [0, 0, 1, 1],
        [0, 0, 0, 1]
      ];

      generateTranslate(smallCircle, e, 0.03);
      generateTranslate(cardHadith, e, 0.03);
      generateTranslate(cardOrangeShine, e, 0.09);
      generateTranslate(circle, e, 0.05);
      generateTranslate(cardComet, e, 0.05);

      card.style.transform = `matrix3d(${matrix.toString()})`;
    }
  }, [])


  function formatBookTitle(book = "") {
    let parts = book.split(" | ")
    switch (parts[0]) {
      case 'bukhari':
        return "Sahih al-Bukhari" + " | " + (parts[1].length > 35 ? parts[1].substring(0, 35) + '...' : parts[1])
      case 'muslim':
        return "Sahih Muslim" + " | " + (parts[1].length > 35 ? parts[1].substring(0, 35) + '...' : parts[1])
      case 'abudawud':
        return "Sunan Abu Dawud" + " | " + (parts[1].length > 35 ? parts[1].substring(0, 35) + '...' : parts[1])
      case 'tirmidhi':
        return "Jami' Tirmidhi" + " | " + (parts[1].length > 35 ? parts[1].substring(0, 35) + '...' : parts[1])
      case 'nasai':
        return "Sunan An-Nasa'i" + " | " + (parts[1].length > 35 ? parts[1].substring(0, 35) + '...' : parts[1])
      case 'ibnmajah':
        return "Sunan Ibn Majah" + " | " + (parts[1].length > 35 ? parts[1].substring(0, 35) + '...' : parts[1])
      default:
        return "loading..."
    }
  }


  return (
    <>
      <div className={styles["wrapper"]}>
        <div className={styles["card"]} ref={$card}>
          <div className={styles["card__cometOuter"]} ref={$cardComet}>
            <div className={styles["card__comet"]}></div>
            <div className={styles["card__comet card__comet--second"]}>
            </div>
          </div>
          <div className={styles["card__circle"]} ref={$circle}></div>
          <div className={styles["card__smallCircle"]} ref={$smallCircle}></div>
          <div className={styles["card__orangeShine"]} ref={$cardOrangeShine}></div>

          <div className={styles["card__hadith"]} ref={$cardHadith}>
            {isArabic ? dailyHadith.arabic.text.substring(0, 450) : dailyHadith.english.text.substring(0, 450)}<a href={`https://sunnah.com/${dailyHadith.book.split(" | ")[0]}:${dailyHadith.english.arabicnumber}`} target={"_blank"} hidden={!(dailyHadith.english.text.length > 450)} style={{ color: 'white', textDecorationStyle: 'none' }}> ...Read more</a>
          </div>
          <div className={styles["card__hadith-details"]}>
            <span>Daily Hadith |   <FontAwesomeIcon icon={faRefresh} onClick={getData} /></span>
            <span>{formatBookTitle(dailyHadith.book)}</span>
            <span><a href={`https://sunnah.com/${dailyHadith.book.split(" | ")[0]}:${dailyHadith.english.arabicnumber}`} target={"_blank"} style={{ color: 'white', textDecorationStyle: 'none' }}>#{dailyHadith.english.arabicnumber}</a></span>
            {dailyHadith.english.grades && dailyHadith.english.grades.length > 0 ?
              <span>
                <FontAwesomeIcon icon={faChevronLeft} color={gradeIndex == 0 ? 'gray' : 'white'} onClick={() => { gradeIndex - 1 >= 0 ? setGradeIndex(gradeIndex - 1) : null; }} />
                <b>{dailyHadith.english.grades[gradeIndex].grade} </b>
                by {dailyHadith.english.grades[gradeIndex].name}
                <FontAwesomeIcon icon={faChevronRight} color={gradeIndex == dailyHadith.english.grades.length - 1 ? 'gray' : 'white'} onClick={() => { gradeIndex + 1 < dailyHadith.english.grades.length ? setGradeIndex(gradeIndex + 1) : null; }} />
              </span> :
              <span><b>Sahih</b></span>}
          </div>
        </div>
        <span className={styles["arabic-toggle"]}>
          <label style={{ marginBottom: '20px', verticalAlign: 'super' }}>   عَرَبِيّ      </label>

          <Switch
            checked={isArabic}
            onChange={() => setIsArabic(!isArabic)}
          />
        </span>
      </div>

    </>)
}

export default App;
