import styles from './BodyWeight.module.css'
import BodyWeightItem from './components/BodyWeightItem'
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import getPaginationData from '../../utils/getPaginationData';
import { LayoutContextType } from '../../types';
import { createBodyWeight, deleteBodyWeightById, updateBodyWeightById } from '../../api/bodyWeightsApi';
import { getVisibleBodyWeights, BodyWeightFilter } from './utils/getVisibleBodyWeights';




type ApplyPresetFilter = Exclude<BodyWeightFilter, 'customDate'>

export default function BodyWeight() {

  const { bodyWeights, setBodyWeights, isBodyWeightsLoading, bodyWeightsError } = useOutletContext<LayoutContextType>();

  const [bodyWeightInputText, setBodyWeightInputText] = useState('');
  const [feedback, setFeedback] = useState<'added' | null>(null)
  const [filter, setFilter] = useState<BodyWeightFilter>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [editBodyWeightId, setEditBodyWeightId] = useState<string | null>(null);
  const [editBodyWeightInputText, setEditBodyWeightInputText] = useState('');
  const [bwInputValidation, setBwInputValidation] = useState(false);
  const [editBwInputValidation, setEditBwInputValidation] = useState(false);

  const [isAddingBodyWeight, setIsAddingBodyWeight] = useState(false);
  const [addBodyWeightError, setAddBodyWeightError] = useState<string | null>(null);
  const [deleteBodyWeightError, setDeleteBodyWeightError] = useState<string | null>(null);
  const [updateBodyWeightError, setUpdateBodyWeightError] = useState<string | null>(null);
  const [isUpdatingBodyWeight, setIsUpdatingBodyWeight] = useState(false);
  const [deleteBodyWeightId, setDeleteBodyWeightId] = useState<string | null>(null);
  const [deletingBodyWeight, setDeletingBodyWeight] = useState(false);

  const bwInputRef = useRef<HTMLInputElement | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('log') === 'true') {
      bwInputRef.current?.focus();
    }
  }, [searchParams]);


  const visibleBodyWeights = getVisibleBodyWeights({
    filter,
    bodyWeights,
    dateFrom,
    dateTo
  })

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 7;

  const { pageNumbers, paginatedData, totalPages } = getPaginationData(itemsPerPage, visibleBodyWeights, currentPage)

  useEffect(() => {
    if (feedback !== 'added') return;

    const addedID = setTimeout(() => {
      setFeedback(null)
    }, 2000)

    return () => clearTimeout(addedID)
  }, [feedback])


  useEffect(() => {
    if (bwInputValidation === false) return;

    const bwInputId = setTimeout(() => {
      setBwInputValidation(false)
    }, 2000

    )

    return () => clearTimeout(bwInputId)
  }, [bwInputValidation])

  useEffect(() => {
    if (editBwInputValidation === false) return;

    const editBBwInputId = setTimeout(() => {
      setEditBwInputValidation(false)
    }, 2000)

    return () => clearTimeout(editBBwInputId)
  }, [editBwInputValidation])

  async function addBodyWeight() {

    const isBodyWeightInvalid =
      bodyWeightInputText === '' || Number(bodyWeightInputText) <= 0;

    if (isBodyWeightInvalid) {
      setBwInputValidation(true);
      return;
    }

    setBwInputValidation(false);

    setIsAddingBodyWeight(true);
    setAddBodyWeightError(null);

    try {
      const savedBodyWeight = await createBodyWeight({
        bw: Number(bodyWeightInputText),
        date: new Date().toISOString().slice(0, 10)
      })

      setBodyWeights((prev) => {
        return [
          savedBodyWeight,
          ...prev
        ]
      })

      setFeedback('added')
      setBodyWeightInputText('');
      setCurrentPage(1);
      navigate('')
    } catch (error) {
      console.error(error);
      setAddBodyWeightError("Failed to add body weight");
    } finally {
      setIsAddingBodyWeight(false);
    }


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

  async function deleteBodyWeight(id: string) {
    setDeleteBodyWeightError(null);
    setDeletingBodyWeight(true);
    setDeleteBodyWeightId(id);
    try {
      await deleteBodyWeightById(id)
      setBodyWeights((prev) => prev.filter((bw) => bw.id !== id))
    } catch (error) {
      console.error("Failed to delete body weight:", error);
      setDeleteBodyWeightError('Failed to delete body weight')
    } finally {
      setDeletingBodyWeight(false);
    }
  }

  function handleEditBodyWeight(id: string, bodyweight: string) {
    setEditBodyWeightInputText(bodyweight)
    setEditBwInputValidation(false);
    setEditBodyWeightId(id);
  }

  function handleEditBwInput(e: React.ChangeEvent<HTMLInputElement>) {
    setEditBodyWeightInputText(e.target.value);
    setEditBwInputValidation(false);
    setUpdateBodyWeightError(null);
  }

  async function handleSaveBodyWeight() {
    setUpdateBodyWeightError(null);

    const isBodyWeightInvalid =
      editBodyWeightInputText === '' || Number(editBodyWeightInputText) <= 0;

    if (isBodyWeightInvalid) {
      setEditBwInputValidation(true);
      return;
    }

    if (!editBodyWeightId) return;

    setEditBwInputValidation(false);
    setIsUpdatingBodyWeight(true);

    try {
      const updatedBodyweight = await updateBodyWeightById(editBodyWeightId, Number(editBodyWeightInputText))


      setBodyWeights((prev) =>
        prev.map((bw) => {
          if (bw.id !== editBodyWeightId) return bw;

          return updatedBodyweight;
        })
      )

      setEditBodyWeightId(null);
      setEditBodyWeightInputText('');
    } catch (error) {
      console.error('Failed to update body weight:', error)
      setUpdateBodyWeightError('Failed to update body weight');
    } finally {
      setIsUpdatingBodyWeight(false);
    }

  }

  return (
    <>
      <header>
        <h1>Body Weight</h1>
      </header>


      <div className={styles["content-wrapper"]}>
        <div className={styles["content-main-wrapper"]}>
          <section className={styles["filter-section-wrapper"]}>
            <h2 className={styles["sr-only"]}>Filters</h2>
            <fieldset className={styles["fieldset-wrapper"]}>
              <legend className={styles["sr-only"]}>Date:</legend>

              <div className={styles["date-from-wrapper"]}>
                <label htmlFor="date-from" className={styles["date-from-label"]}>
                  From
                </label>
                <input type="date" id="date-from" className={styles["date-from-input"]} onChange={handleCustomDateFrom} value={dateFrom} />
              </div>

              <div className={styles["date-to-wrapper"]}>
                <label htmlFor="date-to" className={styles["date-to-label"]}>
                  To
                </label>
                <input type="date" id="date-to" className={styles["date-to-input"]} onChange={handleCustomDateTo} value={dateTo} />
              </div>
            </fieldset>


            <div className={styles["filter-buttons-wrapper"]}>
              <button
                aria-pressed={filter === 'lastWeek'}
                type='button'
                className={filter === 'lastWeek' ? styles["clicked-filter-button"] : styles["last-week-button"]} onClick={() => applyPreset('lastWeek')}>
                Last Week
              </button>

              <button
                aria-pressed={filter === 'lastTwoWeeks'}
                type='button'
                className={filter === 'lastTwoWeeks' ? styles["clicked-filter-button"] : styles["last-2-weeks-button"]} onClick={() => applyPreset('lastTwoWeeks')}>
                Last 2 Weeks
              </button>

              <button
                aria-pressed={filter === 'lastMonth'}
                type='button'
                className={filter === 'lastMonth' ? styles["clicked-filter-button"] : styles["last-month-button"]} onClick={() => applyPreset('lastMonth')}>
                Last Month
              </button>

              <button
                aria-pressed={filter === 'lastTwoMonths'}
                type='button'
                className={filter === 'lastTwoMonths' ? styles["clicked-filter-button"] : styles["last-2-months-button"]} onClick={() => applyPreset('lastTwoMonths')}>
                Last 2 Months
              </button>

              <button
                aria-pressed={filter === 'all'}
                type='button'
                className={filter === 'all' ? styles["clicked-filter-button"] : styles["show-all-button"]} onClick={() => applyPreset('all')}>
                All
              </button>
            </div>
          </section>

          <h2 className={styles["sr-only"]}>Body weight entries</h2>
          {isBodyWeightsLoading ? (
            <p
              role="status"
              className={`${styles['status-message']} ${styles['loading-message']}`}
            >
              Loading body weight logs...
            </p>
          ) : bodyWeightsError ? (
            <p
              role="alert"
              className={`${styles['status-message']} ${styles['error-message']}`}
            >
              <span aria-hidden="true">
                &#10071;
              </span>
              {bodyWeightsError}
            </p>
          ) : bodyWeights.length === 0 ? (
            <p
              className={`${styles['status-message']} ${styles['no-body-weight-logs-text']}`}
            >
              No body weight logs yet
            </p>
          ) : visibleBodyWeights.length === 0 ? (
            <p
              className={`${styles['status-message']} ${styles['no-body-weight-logs-text']}`}
            >
              No body weight logs match your filters
            </p>
          ) : (
            <ul>
              <BodyWeightItem
                bodyWeights={paginatedData}
                deleteBodyWeight={deleteBodyWeight}
                handleEditBodyWeight={handleEditBodyWeight}
                editBodyWeightId={editBodyWeightId}
                handleSaveBodyWeight={handleSaveBodyWeight}
                handleEditBwInput={handleEditBwInput}
                editBodyWeightInputText={editBodyWeightInputText}
                editBwInputValidation={editBwInputValidation}
                updateBodyWeightError={updateBodyWeightError}
                isUpdatingBodyWeight={isUpdatingBodyWeight}
                deletingBodyWeight={deletingBodyWeight}
                deleteBodyWeightError={deleteBodyWeightError}
                deleteBodyWeightId={deleteBodyWeightId}
              />
            </ul>
          )}
          {!isBodyWeightsLoading && !bodyWeightsError && visibleBodyWeights.length > 0 &&
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
            <label htmlFor="body-weight" className={styles["weight-input-label"]}>
              Weight:
            </label>
            <input type="number" id="body-weight" className={styles["weight-input"]} value={bodyWeightInputText} onChange={(e) => {
              setBodyWeightInputText(e.target.value);
              setAddBodyWeightError(null);
              setBwInputValidation(false);
            }} ref={bwInputRef} />
          </div>

          <button type="button" className={styles["add-weight-button"]} onClick={addBodyWeight} disabled={isAddingBodyWeight}>                          Add Weight
          </button>
          {feedback === 'added' ?
            <p role='status' className={styles["body-weight-added"]}>
              <span aria-hidden='true'>&#10004;</span>
              Body weight added
            </p>
            : null}
          {bwInputValidation &&
            <p role='alert' className={styles["weight-validation-text"]}>
              <span aria-hidden='true'>&#10071;</span>
              Please enter a valid weight
            </p>
          }
          {addBodyWeightError && (
            <p role="alert" className={styles["weight-validation-text"]}>
              <span aria-hidden="true">
                &#10071;
              </span>
              {addBodyWeightError}
            </p>
          )}
        </div>

      </div >
    </>
  )
}