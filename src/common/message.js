import {notification } from 'antd';
import 'antd/dist/antd.css';

export function  message(type,message,description) {
  notification[type]({
    message: message,
    description:description
  });
}