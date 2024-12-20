import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { handleNotifications } from '../../reducers/notificationReducer'
import fileUpload from '../../services/fileUpload'

const FileUploadPage = () => {
  const [selectedFile, setSelectedFile] = useState()
  const [isSelected, setIsSelected] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const changeHandler = (event) => {
    const file = event.target.files[0]
    if (validateFile(file)) {
      setSelectedFile(file)
      setIsSelected(true)
    }
  }

  const validateFile = (file) => {
    if (file.type !== 'application/pdf') {
      handleNotifications('Only .pdf allowed', dispatch, 'error')
      return false
    }
    return true
  }

  const handleSubmission = async () => {
    try {
      const res = await fileUpload.upload(selectedFile)
      handleNotifications(res, dispatch, 'notification')
      navigate('/transactions')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <form>
        <div>
          <input type="file" name="file" onChange={changeHandler} />
        </div>
        {isSelected ? (
          <div>
            <p>Filename: {selectedFile.name}</p>
          </div>
        ) : (
          <></>
        )}
        <div>
          <button type="submit" onClick={handleSubmission}>
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default FileUploadPage
