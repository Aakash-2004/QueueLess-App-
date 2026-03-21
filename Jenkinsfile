pipeline {
    agent any

    environment {
        APP_NAME = 'queueless'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
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
                echo 'Building Docker images using docker compose...'
                bat 'docker compose build'
            }
        }

        stage('Deploy Application') {
            steps {
                echo 'Stopping old containers...'
                bat 'docker compose down'

                echo 'Starting new containers...'
                bat 'docker compose up -d'
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Checking running containers...'
                bat 'docker ps'
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
            bat 'docker compose logs'
        }
    }
}
