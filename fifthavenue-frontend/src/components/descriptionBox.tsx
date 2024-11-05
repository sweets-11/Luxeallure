
import "./descriptionBox.css"
interface DescriptionBoxProps {
  description?: string;
}
const DescriptionBox: React.FC<DescriptionBoxProps> = ({ description }) => {
  return (
    <div className='descriptionBox'>
      <div className='descriptionBox-navigator'>
        <div className='descriptionBox-nav-box'>Description</div>
        <div className='descriptionBox-nav-box fade'>Reviews</div>
      </div>
      <div className='descriptionBox-description'>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default DescriptionBox