import {useState, useContext} from "react"

import FormBuilder from "../../../shared/components/Form/FormBuilder"
import { AppContext } from "../../../app/App"
import { createTask, suggestTask } from "../task.api"
import { showToast } from "../../../shared/utils/toast"
function NewTask() {
  const {categoriesList} = useContext(AppContext)
  const [aiData, setAiData] = useState({})

  const newTaskInputs = [
  {
    purpose: 'title',
    textMessage: 'Task Title',
    type: 'text',
    placeholder: 'e.g. Cooking',
    required: true,
    col: 12
  },
  {
    purpose: 'description',
    textMessage: 'Task Description',
    component: 'textarea',
    placeholder: 'e.g. Buy ingredients and start to cook',
    required: false,
    col: 12
  },
  {
    purpose: 'budget',
    textMessage: 'Budget ($)',
    type: 'number',
    placeholder: 'e.g. 50',
    required: false,
    col: 4
  },
  {
    purpose: 'category',
    textMessage: 'Category',
    component: 'select',
    required: true,
    options: categoriesList?categoriesList.split(', '): ['Nothing'],
    col: 8,
    value: aiData.category 
  },
  {
    purpose: 'priority',
    textMessage: 'Priority',
    component: 'select',
    required: false,
    options: ['Low', 'Medium', 'High'],
    col:12,
    value: aiData.priority
  },
  {
    purpose: 'dueDate',
    textMessage: 'Due Date',
    type: 'datetime-local',
    required:false,
    col: 12
  },
  {
    purpose: 'status',
    textMessage: 'Start now?',
    type: 'checkbox',
    required: false,
    col: 6
  }
  ]

  const handleSuggest = async (data) => {
    if (!data.title) {
        showToast('AI Suggest', 'Please enter a task title first!', 'warning')
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
        showToast('AI Suggest', 'Category and priority have been suggested!', 'success')
      } else {
        showToast('AI Suggest Failed', 'Could not generate suggestion, please try again.', 'danger')
      }
    } catch (err){
      showToast('AI Suggest Failed', 'Could not connect to AI, please try again.', 'danger')
    }
    
  }
  
  return (
      <div className="d-flex justify-content-center align-items-center p-4">
          <div className="card border-0 shadow-lg" style={{ width: "400px" }}>
              <FormBuilder 
              title="Post a New Task" 
              inputs={newTaskInputs} 
              submitText={<div><i className="bi bi-plus-circle me-1"></i>Post Task</div>}
              description='Describe your task and get help fast'
              apiFunction={createTask}
              onSuggest={handleSuggest}
              externalData={aiData}/>
              
          </div>
      </div>
  )
}

export default NewTask
