import styles from './BodyWeightItem.module.css'
import formatISODate from '../../../utils/formatISODate'
import { BodyWeight } from '../../../types'

type BodyWeightItemProps = {
  bodyWeights: BodyWeight[]
  deleteBodyWeight: (id: string) => void
  handleEditBodyWeight: (id: string, bodyweight: string) => void
  editBodyWeightId: string | null
  handleEditBwInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  editBodyWeightInputText: string
  handleSaveBodyWeight: () => void
  editBwInputValidation: boolean
  updateBodyWeightError: string | null
  isUpdatingBodyWeight: boolean
  deletingBodyWeight: boolean
  deleteBodyWeightError: string | null
  deleteBodyWeightId: string | null
}

export default function BodyWeightItem({ bodyWeights, deleteBodyWeight, handleEditBodyWeight, editBodyWeightId, handleEditBwInput, editBodyWeightInputText, handleSaveBodyWeight, editBwInputValidation, updateBodyWeightError, isUpdatingBodyWeight, deletingBodyWeight, deleteBodyWeightError, deleteBodyWeightId }: BodyWeightItemProps) {

  return (
    <>
      {bodyWeights.map((bodyweight) => {
        return (
          <li key={bodyweight.id} className={styles['body-weight-item-wrapper']}>

            <div className={styles['body-weight-content-wrapper']}>
              <div className={styles['body-weight-data-wrapper']}>
                <div className={styles['body-weight-date']}>
                  {formatISODate(bodyweight.date)}
                </div>
                <span className={styles['seperator']}>
                  :
                </span>
                {editBodyWeightId === bodyweight.id ?
                  <div>
                    <div className={styles["edit-body-weight-input-wrapper"]}>
                      <label htmlFor={`edit-body-weight-${bodyweight.id}`} className={styles['sr-only']}>Edit body weight</label>
                      <input id={`edit-body-weight-${bodyweight.id}`} type="number" className={styles['edit-body-weight']} onChange={handleEditBwInput} value={editBodyWeightInputText} />
                    </div>
                  </div>
                  :

                  <div className={styles['body-weight']}>
                    {bodyweight.bw} kg
                  </div>
                }

              </div>

              <div className={styles['body-weight-buttons-wrapper']}>
                {editBodyWeightId === bodyweight.id ?
                  <button type='button' className={styles['body-weight-save-button']} onClick={handleSaveBodyWeight} disabled={isUpdatingBodyWeight}>Save</button> :
                  <button type='button' className={styles['body-weight-edit-button']} onClick={() => handleEditBodyWeight(bodyweight.id, String(bodyweight.bw))}>Edit</button>
                }
                <button type='button' className={styles['body-weight-delete-button']} onClick={() => deleteBodyWeight(bodyweight.id)} disabled={deleteBodyWeightId === bodyweight.id && deletingBodyWeight}>Delete</button>
              </div>
            </div>

            {editBodyWeightId === bodyweight.id && editBwInputValidation ? (
              <p role="alert" className={styles['error-message']}>
                <span aria-hidden='true'>&#10071;</span>
                Please enter a valid weight
              </p>
            ) : editBodyWeightId === bodyweight.id && updateBodyWeightError ? (
              <p role="alert" className={styles['error-message']}>
                <span aria-hidden='true'>&#10071;</span>
                {updateBodyWeightError}
              </p>
            ) : deleteBodyWeightId === bodyweight.id && deleteBodyWeightError ? (
              <p
                role="alert"
                className={styles["error-message"]}
              >
                <span aria-hidden='true'>&#10071;</span>
                {deleteBodyWeightError}
              </p>
            ) : null
            }




          </li>
        )
      })}
    </>
  )
}