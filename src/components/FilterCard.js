import {FormGroup,FormControlLabel,Checkbox} from "@mui/material";


const FilterCard = ({Allfilter,handleCheckboxChange})=>{
    return (
        <>
          {Object.entries(Allfilter).map(([category, filters]) =>(
            <FormGroup key={category}>
              <p className="filter-type" >{category}</p>
              {filters.map((filter, index) =>(
                  <FormControlLabel className="formcheckbox" control={<Checkbox />} 
                  label={filter.label ? filter.label : filter.value} 
                  key={filter.id}
                  value={filter.value}
                  name={category}
                  onChange={()=>handleCheckboxChange(category, index)}
                  />
              ))}
            </FormGroup>
          ))}
   
        </>
      );
}

export default FilterCard;