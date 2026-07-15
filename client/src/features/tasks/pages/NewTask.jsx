import {useState, useContext} from "react"
import { useTranslation } from "react-i18next"

import FormBuilder from "../../../shared/components/Form/FormBuilder"
import { AppContext } from "../../../app/App"
import { createTask, suggestTask } from "../task.api"
import { showToast } from "../../../shared/utils/toast"
function NewTask() {
  const {categoriesList} = useContext(AppContext)
  const [aiData, setAiData] = useState({})
  const {t} = useTranslation()

  const newTaskInputs = [
  {
    purpose: 'title',
    textMessage: t('task.title'),
    type: 'text',
    placeholder: t('task.titlePlaceholder'),
    required: true,
    col: 12
  },
  {
    purpose: 'description',
    textMessage: t('task.description'),
    component: 'textarea',
    placeholder: t('task.descriptionPlaceholder'),
    required: false,
    col: 12
  },
  {
    purpose: 'budget',
    textMessage: t('task.budget'),
    type: 'number',
    placeholder: t('task.budgetPlaceholder'),
    required: false,
    col: 4
  },
  {
    purpose: 'category',
    textMessage: t('task.category'),
    component: 'select',
    required: true,
    options: categoriesList?categoriesList.split(', '): ['Nothing'],
    col: 8,
    value: aiData.category 
  },
  {
    purpose: 'priority',
    textMessage: t('task.priority'),
    component: 'select',
    required: false,
    options: ['Low', 'Medium', 'High'],
    col:12,
    value: aiData.priority
  },
  {
    purpose: 'dueDate',
    textMessage: t('task.dueDate'),
    type: 'datetime-local',
    required:false,
    col: 12
  },
  {
    purpose: 'status',
    textMessage: t('task.startNow'),
    type: 'checkbox',
    required: false,
    col: 6
  }
  ]

  const handleSuggest = async (data) => {
    if (!data.title) {
        showToast(t('toast.aiSuggestTitle'), t('toast.aiSuggestNoTitle'), 'warning')
        return
    }
    try {
      const res = await suggestTask({
        title: data.title,
        description: data.description,
        categories: categoriesList
      })
      if (res.success) {
        setAiData(res.suggestion)
        showToast(t('toast.aiSuggestTitle'), t('toast.aiSuggestSuccess'), 'success')
      } else {
        showToast(t('toast.aiSuggestFailedTitle'), t('toast.aiSuggestFailedGenerate'), 'danger')
      }
    } catch (err){
      showToast(t('toast.aiSuggestFailedTitle'), t('toast.aiSuggestFailedConnect'), 'danger')
    }
    
  }
  
  return (
      <div className="d-flex justify-content-center align-items-center p-4">
          <div className="card border-0 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
              <FormBuilder 
              title="Post a New Task" 
              inputs={newTaskInputs} 
              submitText={<div><i className="bi bi-plus-circle me-1"></i>{t('task.postTask')}</div>}
              description={t('task.postTaskSubtitle')}
              apiFunction={createTask}
              onSuggest={handleSuggest}
              externalData={aiData}/>
              
          </div>
      </div>
  )
}

export default NewTask
