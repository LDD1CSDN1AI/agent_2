'use client'
import React, { useEffect } from 'react';
import './App.css';

const my_test = () => {
    useEffect(() => {
        document.title = '测试';
    }, []);

    const handleRedirect = () => {
        console.log("测试-----------------》");

        // API call implementation
        fetch('http://172.27.221.54:18080/workflow-api/ApiController/postApi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "businessType": "1905192821673472001",
                "apiKey": "",
                "apiData": {
                    "user": "xuh",
                    "response_mode": "streaming",
                    "inputs": {
                        "query": "明天天气怎么样"
                    },
                    "files": []
                }
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('API response:', data);
                // Handle the response data here
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle errors here
            });
    };

    handleRedirect();