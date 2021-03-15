import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { handleErrorMessages } from '../../reducers/notificationReducer'
import fileUpload from '../../services/fileUpload'

const FileUploadPage = () => {
  const [selectedFile, setSelectedFile] = useState()
  const [isSelected, setIsSelected] = useState(false)

  const dispatch = useDispatch()

  const reader = new FileReader()

  const changeHandler = (event) => {
    const file = event.target.files[0]
    console.log(file)

    reader.readAsArrayBuffer(file)

    reader.onload = () => {
      console.log(reader.result)
    }
    if (validateFile(file)) {
      setSelectedFile(file)
      setIsSelected(true)
    }
  }

  const validateFile = (file) => {
    if (file.type !== 'application/pdf') {
      handleErrorMessages('Only .pdf allowed', dispatch)
      return false
    }
    return true
  }

  const handleSubmission = async () => {
    try {
      const res = await fileUpload.upload(selectedFile)
      console.log(res)
    } catch (error) {
      console.log(error)
    }
    // fetch(
    // 	'https://freeimage.host/api/1/upload?key=<YOUR_API_KEY>',
    // 	{
    // 		method: 'POST',
    // 		body: formData,
    // 	}
    // )
    // 	.then((response) => response.json())
    // 	.then((result) => {
    // 		console.log('Success:', result);
    // 	})
    // 	.catch((error) => {
    // 		console.error('Error:', error);
    // 	});
  }

  return (
    <div>
      <form>
        <div>
          <input type="file" name="file" onChange={changeHandler} />
        </div>
        <div>
          Month: <input type="text" name="month" /> Year: <input type="text" name="year" />
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
