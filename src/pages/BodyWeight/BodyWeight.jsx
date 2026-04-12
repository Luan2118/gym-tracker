import styles from './BodyWeight.module.css'
import BodyWeightItem from './components/BodyWeightItem'
import setPastDate from '../../utils/setPastDate';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import {sortByNewest} from '../../utils/sortDate';
import getPaginationData from '../../utils/getPaginationData';

export default function BodyWeight() {

  const today = new Date().toISOString();
  const lastWeekDate = setPastDate(7);
  const lastTwoWeeksDate = setPastDate(14);
  const lastMonthDate = setPastDate(30);
  const lastTwoMonthsDate = setPastDate(60);

  const { bodyWeights, setBodyWeights } = useOutletContext();

  const [bodyWeightInputText, setBodyWeightInputText] = useState('');
  const [feedback, setFeedback] = useState(null)
  const [filter, setFilter] = useState(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [editBodyWeightId, setEditBodyWeightId] = useState(null);
  const [editBodyWeightInputText, setEditBodyWeightInputText] = useState('');

  const bwInputRef = useRef(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('log') === 'true') {
      bwInputRef.current.focus()
    }
  }, [searchParams]);

  const sortedByDateBodyWeights = sortByNewest(bodyWeights)

  function getBodyWeightsInRange (bodyWeights, date) {
    return bodyWeights.filter((bw) => today > bw.date && date <= bw.date)
  }

  const lastWeek = getBodyWeightsInRange(sortedByDateBodyWeights, lastWeekDate)
  const lastTwoWeeks = getBodyWeightsInRange(sortedByDateBodyWeights, lastTwoWeeksDate)
  const lastMonth = getBodyWeightsInRange(sortedByDateBodyWeights, lastMonthDate)
  const lastTwoMonths = getBodyWeightsInRange(sortedByDateBodyWeights, lastTwoMonthsDate)
  const customDate = sortedByDateBodyWeights.filter((bw) => dateFrom <= bw.date && dateTo >= bw.date)

  const visibleBodyWeights =
    filter === 'lastWeek' ? lastWeek :
      filter === 'lastTwoWeeks' ? lastTwoWeeks :
        filter === 'lastMonth' ? lastMonth :
          filter === 'lastTwoMonths' ? lastTwoMonths :
            filter === 'customDate' ? customDate :
              sortedByDateBodyWeights


  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const {pageNumbers, paginatedData, totalPages} = getPaginationData(itemsPerPage,visibleBodyWeights, currentPage )

  useEffect(() => {
    if (feedback !== 'added') return;

    const addedID = setTimeout(() => {
      setFeedback(null)
    }, 4000)

    return () => clearTimeout(addedID)
  }, [feedback])

  function addBodyWeight() {
    setBodyWeights((prev) => {
      return [
        ...prev,
        { bw: Number(bodyWeightInputText), id: crypto.randomUUID(), date: today }
      ]
    })

    setFeedback('added')
    setCurrentPage(1);
    navigate('')
  }

  function handleCustomDate(e) {
    setDateTo(e.target.value);
    setFilter('customDate')
    setCurrentPage(1);
  }

  function applyPreset(preset) {
    setFilter(preset);
    setDateFrom('');
    setDateTo('')
    setCurrentPage(1);
  }

  function deleteBodyWeight(id) {
    setBodyWeights((prev) => prev.filter((bw) => bw.id !== id))
  }

  function handleEditBodyWeight(id) {
    setEditBodyWeightId(id);
  }

  function handleEditBwInput(e) {
    setEditBodyWeightInputText(e.target.value)
  }

  function handleSaveBodyWeight() {
    setBodyWeights((prev) =>
      prev.map((bw) => {
        if (bw.id !== editBodyWeightId) return bw;

        return {
          ...bw,
          bw: editBodyWeightInputText
        }
      })
    )
    setEditBodyWeightId(null);
    setEditBodyWeightInputText('');
  }

  return (
    <>
      <header>
        <h1>Body Weight</h1>
      </header>


      <div className={styles["content-wrapper"]}>
        <div className={styles["content-main-wrapper"]}>
          <section className={styles["filter-section-wrapper"]}>
            <fieldset className={styles["fieldset-wrapper"]}>
              <legend className={styles["sr-only"]}>Date:</legend>

              <div className={styles["date-from-wrapper"]}>
                <label htmlFor="date-from" className={styles["date-from-label"]}>From</label>
                <input type="date" id="date-from" className={styles["date-from-input"]} onChange={(e) => setDateFrom(e.target.value)} value={dateFrom} />
              </div>

              <div className={styles["date-to-wrapper"]}>
                <label htmlFor="date-to" className={styles["date-to-label"]}>To</label>
                <input type="date" id="date-to" className={styles["date-to-input"]} onChange={handleCustomDate} value={dateTo} />
              </div>
            </fieldset>

            <div className={styles["filter-buttons-wrapper"]}>
              <button type='button' className={filter === 'lastWeek' ? styles["clicked-filter-button"] : styles["last-week-button"]} onClick={() => applyPreset('lastWeek')}>Last Week</button>
              <button type='button' className={filter === 'lastTwoWeeks' ? styles["clicked-filter-button"] : styles["last-2-weeks-button"]} onClick={() => applyPreset('lastTwoWeeks')}>Last 2 Weeks</button>
              <button type='button' className={filter === 'lastMonth' ? styles["clicked-filter-button"] : styles["last-month-button"]} onClick={() => applyPreset('lastMonth')}>Last Month</button>
              <button type='button' className={filter === 'lastTwoMonths' ? styles["clicked-filter-button"] : styles["last-2-months-button"]} onClick={() => applyPreset('lastTwoMonths')}>Last 2 Months</button>
              <button type='button' className={filter === 'all' ? styles["clicked-filter-button"] : styles["show-all-button"]} onClick={() => applyPreset('all')}>Show All</button>
            </div>

          </section>

          <ul >
            <BodyWeightItem bodyWeights={paginatedData} deleteBodyWeight={deleteBodyWeight} handleEditBodyWeight={handleEditBodyWeight} editBodyWeightId={editBodyWeightId} handleSaveBodyWeight={handleSaveBodyWeight} handleEditBwInput={handleEditBwInput} editBodyWeightInputText={editBodyWeightInputText} />
          </ul>

          <div className={styles["pagination-wrapper"]}>
            <button type="button" className={styles["pagination-button"]} onClick={() => setCurrentPage((prev) => prev - 1)} disabled={currentPage === 1}>Prev</button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                type="button"
                className={
                  currentPage === page
                    ? styles["active-page-button"]
                    : styles["page-button"]
                }
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button type="button" className={styles["pagination-button"]} onClick={() => setCurrentPage((prev) => prev + 1)} disabled={currentPage === totalPages}>Next</button>
          </div>
        </div>


        <div className={styles["weight-submit-wrapper"]}>

          <div className={styles["weight-input-wrapper"]}>
            <label htmlFor="body-weight" className={styles["weight-input-label"]}>Weight: </label>
            <input type="number" id="body-weight" className={styles["weight-input"]} value={bodyWeightInputText} onChange={(e) => setBodyWeightInputText(e.target.value)} ref={bwInputRef} />
          </div>

          <button className={styles["add-weight-button"]} onClick={addBodyWeight}>Add Weight</button>
          {feedback === 'added' ?
            <div className={styles["body-weight-added"]}><span className={styles["body-weight-added-icon"]}>&#9989;</span> Body weight added</div>
            : null}
        </div>

      </div>
    </>
  )
}