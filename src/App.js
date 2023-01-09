import React, { useState, useEffect, useRef, useContext } from 'react';
import { Button, Space, Form, Input, Table, message, Upload } from 'antd';
import 'antd/dist/reset.css';
import './App.css';
import useSpaLogo from './hooks/useSpaLogo';
import useWinSize from './hooks/useWinSize';
import { columns as defaultColumns } from './columns';
import {
  generate,
  importFile,
  load,
  save
} from './services/index'
import { isSuccess } from './utils/utils';

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

function App() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading1, setBtnLoading1] = useState(false);
  const [btnLoading2, setBtnLoading2] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    doload();
  }, [])

  const [logo] = useSpaLogo();
  const winSize = useWinSize();

  const doload = async () => {
    try {
      setLoading(true);
      let responseData = await load();
      isSuccess({
        res: responseData,
        success: data => setDataSource(data.map((el, index) => ({ ...el, key: index.toString() })))
      });
    } catch (errInfo) {
      console.log('load failed:', errInfo);
    } finally {
      setLoading(false);
    }
  }

  const dosave = async (data) => {
    try {
      setBtnLoading1(true)
      let responseData = await save(data);
      isSuccess({
        res: responseData,
        success: () => {
          message.success('保存成功');
        }
      })
    } catch (errInfo) {
      console.log('save failed', errInfo);
    } finally {
      setBtnLoading1(false);
    }
  }

  const dogenerate = async (data) => {
    try {
      setBtnLoading2(true)
      let responseData = await generate(data);
      isSuccess({
        res: responseData,
        success: () => {
          message.success('生成视频成功');
        }
      })
    } catch (errInfo) {
      console.log('generate failed', errInfo);
    } finally {
      setBtnLoading2(false);
    }
  }

  const doupload = async (info) => {
    try {
      const { file } = info;
      let data = new FormData();
      data.append('file', file);
      setUploading(true)
      let responseData = await importFile(data);
      isSuccess({
        res: responseData,
        success: (data) => {
          setDataSource(data.map((el, index) => ({ ...el, key: index.toString() })));
          message.success('导入成功');
        }
      });
    } catch (errInfo) {
      console.log('importFile failed', errInfo);
      message.error('导入失败，请重试');
    } finally {
      setUploading(false);
    }
  }

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div className="App">
      <div className="App-header flex-start-center">
        <div className="App-header-left">
          {logo}
        </div>
        <Space size={14}>
          <Upload
            showUploadList={false}
            customRequest={doupload}
          >
            <Button className="gray custom-rds" type="primary" loading={uploading}>导入电码</Button>
          </Upload>
          <Button
            className="actionButton gray custom-rds"
            type="primary"
            onClick={() => dosave(dataSource)}
            loading={btnLoading1}
            // disabled={dataSource.length === 0}
            disabled={true}
          >保 存</Button>
          <Button
            className="custom-rds"
            type="primary"
            onClick={() => dogenerate(dataSource)}
            loading={btnLoading2}
            disabled={dataSource.length === 0}
          >生成视频</Button>
        </Space>
      </div>
      <div className="App-main">
        <div className="App-main-content">
          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            scroll={{ y: winSize.height - 104 - 56 }}
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
