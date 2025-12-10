pipeline {
    agent any

    environment {
        DEPLOYMENT_SERVER = '192.168.10.46'
        DEPLOYMENT_DIRECTORY = '~/firepulse-ui'
        IMAGE_TAG = 'latest'
    }

    stages {
        stage('Transfer Configuration') {
            steps {
                script {
                    withCredentials([
                        string(credentialsId: 'ssh-user', variable: 'SSH_USER'),
                        string(credentialsId: 'ssh-password', variable: 'SSH_PASSWORD'),
                    ]) {
                        // Create/Override .env file on deployment server
                        sh """
                            sshpass -p "${SSH_PASSWORD}" ssh -o StrictHostKeyChecking=no ${SSH_USER}@${DEPLOYMENT_SERVER} '
                                mkdir -p ${DEPLOYMENT_DIRECTORY}
                                echo "IMAGE_TAG=${IMAGE_TAG}" >> ${DEPLOYMENT_DIRECTORY}/.env
                                chmod 600 ${DEPLOYMENT_DIRECTORY}/.env
                            '
                        """
                        // Transfer docker-compose.yaml
                        sh """
                            sshpass -p "${SSH_PASSWORD}" scp -o StrictHostKeyChecking=no docker-compose.yaml ${SSH_USER}@${DEPLOYMENT_SERVER}:${DEPLOYMENT_DIRECTORY}/
                        """
                    }
                }
            }
        }

        stage('Deploy Service') {
            steps {
                script {
                    withCredentials([
                        string(credentialsId: 'ssh-user', variable: 'SSH_USER'),
                        string(credentialsId: 'ssh-password', variable: 'SSH_PASSWORD'),
                        string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')
                    ]) {
                        try {
                            sh """
                                sshpass -p "${SSH_PASSWORD}" ssh -o StrictHostKeyChecking=no ${SSH_USER}@${DEPLOYMENT_SERVER} '
                                    set -e
                                    echo "${GITHUB_TOKEN}" | docker login ghcr.io -u "jenkins" --password-stdin
                                    cd ${DEPLOYMENT_DIRECTORY}
                                    echo "Pulling updated image for service..."
                                    docker compose pull web-service
                                    echo "Starting service..."
                                    docker compose up -d web-service --wait
                                    echo "Service deployed successfully!"
                                '
                            """
                        } catch (err) {
                            echo "Deployment process encountered an error: ${err}"
                            error(err.toString())
                        } finally {
                            // always attempt to clean up images and logout from registry
                            sh """
                                sshpass -p "${SSH_PASSWORD}" ssh -o StrictHostKeyChecking=no ${SSH_USER}@${DEPLOYMENT_SERVER} '
                                    docker image prune -f || true
                                    docker logout ghcr.io || true
                                '
                            """
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✓ Deployment completed successfully!"
        }
        failure {
            echo "✗ Deployment failed!"
        }
        always {
            cleanWs()
        }
    }
}
