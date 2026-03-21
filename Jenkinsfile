pipeline {
    agent any

    environment {
        APP_NAME = 'queueless'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        DOCKER_PATH = '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe"'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Cloning repository...'
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
                echo 'Building Docker images using Docker Compose...'
                bat "%DOCKER_PATH% compose build"
            }
        }

        stage('Deploy Application') {
            steps {
                echo 'Stopping old containers...'
                bat "%DOCKER_PATH% compose down"

                echo 'Starting new containers...'
                bat "%DOCKER_PATH% compose up -d"
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Checking running containers...'
                bat "%DOCKER_PATH% ps"
            }
        }
    }

    post {
        success {
            echo '✅ SUCCESS: Application deployed successfully!'
        }
        failure {
            echo '❌ FAILURE: Something went wrong!'
            echo 'Showing container logs...'
            bat "%DOCKER_PATH% compose logs"
        }
    }
}
