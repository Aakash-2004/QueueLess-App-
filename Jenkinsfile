pipeline {
    agent any

    environment {
        APP_NAME = 'queueless'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Backend Dependencies...'
                dir('server') {
                    bat 'npm install'
                }

                echo 'Installing Frontend Dependencies...'
                dir('client') {
                    bat 'npm install'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building using Docker Compose...'
                bat 'docker-compose build'
            }
        }

        stage('Deploy Container') {
            steps {
                echo 'Deploying application...'
                bat 'docker-compose down'
                bat 'docker-compose up -d'
            }
        }
    }
}
