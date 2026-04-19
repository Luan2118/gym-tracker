import styles from './BodyWeight.module.css'
import BodyWeightItem from './components/BodyWeightItem'
import setPastDate from '../../utils/setPastDate';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import { sortByNewest } from '../../utils/sortDate';
import getPaginationData from '../../utils/getPaginationData';
import { BodyWeight as BodyWeightType, LayoutContextType } from '../../types';
import formatISODate from '../../utils/formatISODate';

type BodyWeightFilter =
  | 'lastWeek'
  | 'lastTwoWeeks'
  | 'lastMonth'
  | 'lastTwoMonths'
  | 'customDate'
  | 'all'


type ApplyPresetFilter = Exclude<BodyWeightFilter, 'customDate'>

export default function BodyWeight() {

  const today = new Date().toISOString();
  const lastWeekDate = setPastDate(7);
  const lastTwoWeeksDate = setPastDate(14);
  const lastMonthDate = setPastDate(30);
  const lastTwoMonthsDate = setPastDate(60);

  const { bodyWeights, setBodyWeights } = useOutletContext<LayoutContextType>();

  const [bodyWeightInputText, setBodyWeightInputText] = useState('');
  const [feedback, setFeedback] = useState<'added' | null>(null)
  const [filter, setFilter] = useState<BodyWeightFilter>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [editBodyWeightId, setEditBodyWeightId] = useState<string | null>(null);
  const [editBodyWeightInputText, setEditBodyWeightInputText] = useState('');
  const [bwInputValidation, setBwInputValidation] = useState(false);
  const [editBwInputValidation, setEditBwInputValidation] = useState(false);

  const bwInputRef = useRef<HTMLInputElement | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('log') === 'true') {
      bwInputRef.current?.focus();
    }
  }, [searchParams]);

  const sortedByDateBodyWeights = sortByNewest(bodyWeights)

  function getBodyWeightsInRange(bodyWeights: BodyWeightType[], date: string): BodyWeightType[] {
    return bodyWeights.filter((bw) => today > bw.date && date <= bw.date)
  }

  const lastWeek = getBodyWeightsInRange(sortedByDateBodyWeights, lastWeekDate)
  const lastTwoWeeks = getBodyWeightsInRange(sortedByDateBodyWeights, lastTwoWeeksDate)
  const lastMonth = getBodyWeightsInRange(sortedByDateBodyWeights, lastMonthDate)
  const lastTwoMonths = getBodyWeightsInRange(sortedByDateBodyWeights, lastTwoMonthsDate)
  const customDate = sortedByDateBodyWeights.filter((bw) => {
    const bwDate = bw.date.slice(0, 10);
    const from = dateFrom || '0000-01-01';
    const to = dateTo || '9999-12-31';


    return from <= bwDate && to >= bwDate;
  });

  const visibleBodyWeights =
    filter === 'lastWeek' ? lastWeek :
      filter === 'lastTwoWeeks' ? lastTwoWeeks :
        filter === 'lastMonth' ? lastMonth :
          filter === 'lastTwoMonths' ? lastTwoMonths :
            filter === 'customDate' ? customDate :
              sortedByDateBodyWeights


  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const { pageNumbers, paginatedData, totalPages } = getPaginationData(itemsPerPage, visibleBodyWeights, currentPage)

  useEffect(() => {
    if (feedback !== 'added') return;

    const addedID = setTimeout(() => {
      setFeedback(null)
    }, 4000)

    return () => clearTimeout(addedID)
  }, [feedback])


  useEffect(() => {
    if (bwInputValidation === false) return;

    const bwInputId = setTimeout(() => {
      setBwInputValidation(false)
    }, 4000)

    return () => clearTimeout(bwInputId)
  }, [bwInputValidation])

  useEffect(() => {
    if (editBwInputValidation === false) return;

    const editBBwInputId = setTimeout(() => {
      setEditBwInputValidation(false)
    }, 4000)

    return () => clearTimeout(editBBwInputId)
  }, [editBwInputValidation])

  function addBodyWeight() {
    const isBodyWeightInvalid =
      bodyWeightInputText === '' || Number(bodyWeightInputText) <= 0;

    if (isBodyWeightInvalid) {
      setBwInputValidation(true);
      return;
    }

    setBwInputValidation(false);

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

  function handleCustomDateFrom(e: React.ChangeEvent<HTMLInputElement>) {
    setDateFrom(e.target.value);
    setFilter('customDate')
    setCurrentPage(1);
  }

  function handleCustomDateTo(e: React.ChangeEvent<HTMLInputElement>) {
    setDateTo(e.target.value);
    setFilter('customDate')
    setCurrentPage(1);
  }

  function applyPreset(preset: ApplyPresetFilter) {
    setFilter(preset);
    setDateFrom('');
    setDateTo('')
    setCurrentPage(1);
  }

  function deleteBodyWeight(id: string) {
    setBodyWeights((prev) => prev.filter((bw) => bw.id !== id))
  }

  function handleEditBodyWeight(id: string) {
    setEditBwInputValidation(false);
    setEditBodyWeightId(id);
  }

  function handleEditBwInput(e: React.ChangeEvent<HTMLInputElement>) {
    setEditBodyWeightInputText(e.target.value)
  }

  function handleSaveBodyWeight() {
    const isBodyWeightInvalid =
      editBodyWeightInputText === '' || Number(editBodyWeightInputText) <= 0;

    if (isBodyWeightInvalid) {
      setEditBwInputValidation(true);
      return;
    }

    setEditBwInputValidation(false);
    setBodyWeights((prev) =>
      prev.map((bw) => {
        if (bw.id !== editBodyWeightId) return bw;

        return {
          ...bw,
          bw: Number(editBodyWeightInputText)
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
                <input type="date" id="date-from" className={styles["date-from-input"]} onChange={handleCustomDateFrom} value={dateFrom} />
              </div>

              <div className={styles["date-to-wrapper"]}>
                <label htmlFor="date-to" className={styles["date-to-label"]}>To</label>
                <input type="date" id="date-to" className={styles["date-to-input"]} onChange={handleCustomDateTo} value={dateTo} />
              </div>
            </fieldset>


            <div className={styles["filter-buttons-wrapper"]}>
              <button type='button' className={filter === 'lastWeek' ? styles["clicked-filter-button"] : styles["last-week-button"]} onClick={() => applyPreset('lastWeek')}>Last Week</button>
              <button type='button' className={filter === 'lastTwoWeeks' ? styles["clicked-filter-button"] : styles["last-2-weeks-button"]} onClick={() => applyPreset('lastTwoWeeks')}>Last 2 Weeks</button>
              <button type='button' className={filter === 'lastMonth' ? styles["clicked-filter-button"] : styles["last-month-button"]} onClick={() => applyPreset('lastMonth')}>Last Month</button>
              <button type='button' className={filter === 'lastTwoMonths' ? styles["clicked-filter-button"] : styles["last-2-months-button"]} onClick={() => applyPreset('lastTwoMonths')}>Last 2 Months</button>
              <button type='button' className={filter === 'all' ? styles["clicked-filter-button"] : styles["show-all-button"]} onClick={() => applyPreset('all')}>All</button>
            </div>

          </section>

          <ul >
            <BodyWeightItem bodyWeights={paginatedData} deleteBodyWeight={deleteBodyWeight} handleEditBodyWeight={handleEditBodyWeight} editBodyWeightId={editBodyWeightId} handleSaveBodyWeight={handleSaveBodyWeight} handleEditBwInput={handleEditBwInput} editBodyWeightInputText={editBodyWeightInputText} editBwInputValidation={editBwInputValidation} />
          </ul>

          {bodyWeights.length > 0 &&
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
          }
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
          {bwInputValidation && <div className={styles["weight-validation-text"]}>Please enter a valid weight</div>}
        </div>

      </div>
    </>
  )
}