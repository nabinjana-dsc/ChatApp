import { useCallback, useState } from 'react';
import { Icon, Input, InputGroup } from 'rsuite';

const EditableInput = ({
  initialValue,
  onSave,
  label = null,
  placeholder = 'Write your value ',
  emptyMsg = 'Input is Empty',
  ...inputProps
}) => {
  const [input, setInput] = useState(initialValue);
  const [isEditable, setIsEditable] = useState(false);

  const onInputChange = useCallback(value => {
    setInput(value);
  }, []);

  const onEditClick = useCallback(() => {
    setIsEditable(p => !p);
    setInput(initialValue);
  }, [initialValue]);

  return (
    <div>
      {label}

      <Input
        {...inputProps}
        disabled={!isEditable}
        placeholder={placeholder}
        value={input}
        onChange={onInputChange}
      />
      <InputGroup.Button onClick={onEditClick}>
        <Icon icon={isEditable ? 'close' : 'edit2'} />
      </InputGroup.Button>
      {isEditable && (
        <InputGroup.Button>
          <Icon icon={isEditable ? 'close' : 'edit2'} />
        </InputGroup.Button>
      )}
    </div>
  );
};

export default EditableInput;
