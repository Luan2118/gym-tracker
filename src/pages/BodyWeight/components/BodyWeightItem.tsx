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
}

export default function BodyWeightItem({ bodyWeights, deleteBodyWeight, handleEditBodyWeight, editBodyWeightId, handleEditBwInput, editBodyWeightInputText, handleSaveBodyWeight, editBwInputValidation }: BodyWeightItemProps) {

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
                      <label htmlFor="edit-body-weight"></label>
                      <input id="edit-body-weight" type="number" className={styles['edit-body-weight']} onChange={handleEditBwInput} value={editBodyWeightInputText}/>
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
                  <button type='button' className={styles['body-weight-save-button']} onClick={handleSaveBodyWeight}>Save</button> :
                  <button type='button' className={styles['body-weight-edit-button']} onClick={() => handleEditBodyWeight(bodyweight.id, String(bodyweight.bw))}>Edit</button>
                }
                <button type='button' className={styles['body-weight-delete-button']} onClick={() => deleteBodyWeight(bodyweight.id)}>Delete</button>
              </div>
            </div>

            {editBodyWeightId === bodyweight.id ?
              <div className={styles['weight-validation-text-wrapper']}>
                {editBwInputValidation ? <div className={styles["weight-validation-text"]}> Please enter a valid weight</div> : null}
              </div>
              :
              null
            }

          </li>
        )
      })}

      {bodyWeights.length === 0 && <div className={styles['no-body-weight-logs-yet-text']}>No body weight logs yet</div>}
    </>
  )
}