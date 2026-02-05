import FormBuilder from "../../../shared/components/FormBuilder"

function NewTask() {
  const newTaskInputs = [
  {
    purpose: 'title',
    textMessage: 'Task Title',
    type: 'text',
    required: true,
    col: 12
  },
  {
    purpose: 'description',
    textMessage: 'Task Description',
    component: 'textarea',
    required: false,
    rows: 4,
    col: 12
  },
  {
    purpose: 'budget',
    textMessage: 'Budget ($)',
    type: 'number',
    required: false,
    col: 6
  },
  {
    purpose: 'dueDate',
    textMessage: 'Due Date',
    type: 'date',
    required:false,
    col: 6
  },
  {
    purpose: 'category',
    textMessage: 'Category',
    component: 'select',
    options: [
      'Housework',
      'Schoolwork',
      'Job',
      'Other',
    ],
    col: 12
  }
  ]
  const apiFunction = ()=> {console.log('API is calling')}
  
  return (
      <div className="d-flex justify-content-center align-items-center p-4">
          <div className="card border-0 shadow-lg" style={{ width: "400px" }}>
              <FormBuilder 
              title="Post a New Task" 
              inputs={newTaskInputs} 
              submitText={<div><i className="bi bi-plus-circle me-1"></i>Post Task</div>}
              description='Describe your task and get help fast'
              apiFunction={apiFunction}/>
          </div>
      </div>
  )
}

export default NewTask
