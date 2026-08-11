import { useCallback } from 'react'
import useCartQueueStore from '../stores/useCartQueueStore'

const useCartQueue = () => {
  const enqueue = useCartQueueStore((state) => state.enqueue)

  const processQueue = useCallback(async () => {
    const store = useCartQueueStore.getState()

    if (store.isProcessing || store.queue.length === 0) return

    store.startProcessing()
    const task = store.queue[0]

    try {
      if (typeof task?.run === 'function') {
        await task.run()
      }
    } finally {
      const latestStore = useCartQueueStore.getState()
      latestStore.dequeue()
      latestStore.stopProcessing()
      setTimeout(processQueue, 0)
    }
  }, [])

  const enqueueTask = useCallback(
    (task, itemId) => {
      enqueue(task, itemId)
      processQueue()
    },
    [enqueue, processQueue]
  )

  return { enqueueTask }
}

export default useCartQueue
