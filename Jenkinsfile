pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        APP_NAME = 'queueless'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout code from Bitbucket
                checkout scm
            }
        }

        stage('Install Dependencies & Test') {
            steps {
                echo 'Installing Backend Dependencies...'
                dir('server') {
                    sh 'npm install'
                    // sh 'npm test' // Uncomment when tests are added
                }
                echo 'Installing Frontend Dependencies...'
                dir('client') {
                    sh 'npm install'
                    // sh 'npm run build' // Test build
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building using Docker Compose...'
                sh 'docker-compose build'
            }
        }

        stage('Deploy Container') {
            steps {
                echo 'Deploying application locally using Docker Compose...'
                sh 'docker-compose down'
                sh 'docker-compose up -d'
            }
            post {
                success {
                    echo 'Deployment Successful! App is running.'
                }
                failure {
                    echo 'Deployment Failed. Rolling back changes.'
                    sh 'docker-compose logs'
                }
            }
        }
    }
}
