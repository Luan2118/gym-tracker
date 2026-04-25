import styles from './TrainingSplitItem.module.css'

type TrainingSplitListItem = {
  id: string
  name: string
}

type TrainingSplitItemProps = {
  trainingSplits: TrainingSplitListItem[]
  editTrainingSplit: (id: string) => void
  deleteTrainingSplit: (id: string) => void
  isDeletingTrainingSplitId: string | null
  deleteTrainingSplitError: string | null
  deleteTrainingSplitErrorId: string | null
}

export default function TrainingSplitItem({ trainingSplits, editTrainingSplit, deleteTrainingSplit, isDeletingTrainingSplitId, deleteTrainingSplitError, deleteTrainingSplitErrorId }: TrainingSplitItemProps) {

  return (
    <>
      {trainingSplits.map((trainingSplit) => {
        return (
          <section className={styles["training-split-wrapper"]} key={trainingSplit.id}>
            <div className={styles["training-split-content-wrapper"]}>
              <h3>{trainingSplit.name}</h3>

              <div className={styles["button-wrapper"]}>
                <button type='button' className={styles["modify-button"]} onClick={() => editTrainingSplit(trainingSplit.id)} disabled={isDeletingTrainingSplitId !== null}>Edit</button>
                <button type='button' className={styles["delete-button"]} onClick={() => deleteTrainingSplit(trainingSplit.id)} disabled={deleteTrainingSplitErrorId === trainingSplit.id && isDeletingTrainingSplitId !== null}>Delete</button>
              </div>
            </div>

            {deleteTrainingSplitErrorId === trainingSplit.id && deleteTrainingSplitError &&
              <p role='alert' className={styles['delete-training-split-message']}>
                <span aria-hidden='true'>&#10071;</span>
                {deleteTrainingSplitError}
              </p>
            }
          </section>
        )
      })}
    </>
  )
}