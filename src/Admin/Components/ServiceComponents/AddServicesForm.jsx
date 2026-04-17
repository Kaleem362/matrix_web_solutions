import React from 'react'

const AddServicesForm = () => {
  return (
    <div className='service-submission-form'>
      <div className="header">
        <h1>Add Service</h1>
      </div>
      <div className="form-body">
        <form action="" method="post" onSubmit={}>
            <input type="text" placeholder="Service Name" id='service-name' className='service-input' className="border border-indigo-300 bg-white
            " />
        </form>
      </div>
    </div>
  )
}

export default AddServicesForm
